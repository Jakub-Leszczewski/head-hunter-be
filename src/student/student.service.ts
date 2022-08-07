import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangeStudentStatusResponse,
  CompleteStudentResponse,
  ContractType,
  CreateStudentsResponse,
  GetStudentResponse,
  GetStudentsResponse,
  StudentStatus,
  UpdateStudentResponse,
  UserRole,
  WorkType,
} from '../types';
import { UserService } from '../user/user.service';
import { Student } from './entities/student.entity';
import { BonusProjectUrl } from './entities/bonus-project-url.entity';
import { User } from '../user/entities/user.entity';
import { v4 as uuid } from 'uuid';
import { MailService } from '../common/providers/mail/mail.service';
import { config } from '../config/config';
import { hashPwd } from '../common/utils/hashPwd';
import { ProjectUrl } from './entities/project-url.entity';
import { PortfolioUrl } from './entities/portfolio-url.entity';
import { compare } from 'bcrypt';
import { isNotEmpty } from '../common/utils/check-object';
import { UserHelperService } from '../user/user-helper.service';
import { StudentHelperService } from './student-helper.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { CompletionStudentDto } from './dto/completion-student.dto';
import { ImportStudentDto } from './dto/import-student.dto';
import { FindAllQueryDto } from './dto/find-all-query.dto';
import { ChangeStatusDto } from './dto/change-status.dto';
import { HrService } from '../hr/hr.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class StudentService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => HrService)) private hrService: HrService,
    @Inject(forwardRef(() => UserHelperService)) private userHelperService: UserHelperService,
    private studentHelperService: StudentHelperService,
    private notificationService: AdminService,
    private mailService: MailService,
  ) {}

  async findAll(query: FindAllQueryDto): Promise<GetStudentsResponse> {
    const { search, sortBy, sortMethod, page, status } = query;

    const [result, totalEntitiesCount] = await this.studentHelperService
      .findAllStudentsQb(
        this.studentHelperService.statusStudentQbCondition(status),
        this.studentHelperService.filterStudentQbCondition(query),
        this.studentHelperService.searchStudentQbCondition(search),
        this.studentHelperService.orderByStudentQbCondition(sortBy, sortMethod),
        this.studentHelperService.paginationStudentQbCondition(page, config.maxItemsOnPage),
      )
      .getManyAndCount();

    return {
      result: result.map((e) => this.studentHelperService.filterSmallStudent(e)),
      totalEntitiesCount,
      totalPages: Math.ceil(totalEntitiesCount / config.maxItemsOnPage),
    };
  }

  async findOne(id: string): Promise<GetStudentResponse> {
    if (!id) throw new BadRequestException();

    const user = await User.findOne({
      where: {
        id,
        role: UserRole.Student,
      },
      relations: ['student'],
    });

    if (!user) throw new NotFoundException();

    return this.studentHelperService.filterStudent(user);
  }

  async importStudents(createStudentDto: ImportStudentDto[]): Promise<CreateStudentsResponse> {
    const studentResponse: any = [];
    for await (const studentDto of createStudentDto) {
      const emailUniqueness = await this.userHelperService.checkUserFieldUniqueness({
        email: studentDto.email,
      });

      if (emailUniqueness) {
        const student = new Student();
        student.courseCompletion = studentDto.courseCompletion;
        student.courseEngagement = studentDto.courseEngagement;
        student.projectDegree = studentDto.projectDegree;
        student.teamProjectDegree = studentDto.teamProjectDegree;
        student.courseCompletion = studentDto.courseCompletion;
        student.expectedTypeWork = WorkType.Irrelevant;
        student.expectedContractType = ContractType.Irrelevant;
        await student.save();

        student.bonusProjectUrls = await this.insertUrls(
          studentDto.bonusProjectUrls,
          student,
          BonusProjectUrl,
        );
        await student.save();

        const user = new User();
        user.email = studentDto.email;
        user.role = UserRole.Student;
        user.isActive = false;
        user.userToken = uuid();
        user.userTokenExpiredAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14);
        await user.save();

        user.student = student;
        await user.save();

        await this.mailService.sendStudentSignupEmail(user.email, {
          signupUrl: `${config.feUrl}/signup/student/${user.id}/${user.userToken}`,
          courseCompletion: student.courseCompletion,
          courseEngagement: student.courseEngagement,
          projectDegree: student.projectDegree,
          teamProjectDegree: student.teamProjectDegree,
        });

        studentResponse.push(user);
      }
    }

    return studentResponse.map((e) => this.studentHelperService.filterStudent(e));
  }

  async completeSignup(
    userToken: string,
    completionStudentDto: CompletionStudentDto,
  ): Promise<CompleteStudentResponse> {
    if (!userToken) throw new BadRequestException();

    const { firstName, lastName, email, newPassword, projectUrls, portfolioUrls, ...studentDto } =
      completionStudentDto;

    const user = await this.getStudent({ userToken });
    if (!user || !user.student) throw new NotFoundException();
    if (user.isActive) throw new ForbiddenException();
    if (user.userTokenExpiredAt < new Date()) throw new ForbiddenException();

    if (!(await this.studentHelperService.checkGithubExist(completionStudentDto.githubUsername)))
      throw new NotFoundException('Not found github account');

    await this.studentHelperService.checkStudentFieldUniquenessAndThrow({
      githubUsername: completionStudentDto.githubUsername,
    });

    if (completionStudentDto.email && completionStudentDto.email === user.email) {
      await this.userHelperService.checkUserFieldUniquenessAndThrow({
        email: completionStudentDto.email,
      });
    }

    if (isNotEmpty(studentDto)) await Student.update({ id: user.student.id }, studentDto);

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email ?? user.email;
    user.hashPwd = await hashPwd(newPassword);
    user.isActive = true;
    user.userToken = null;
    user.userTokenExpiredAt = null;

    await user.student.reload();
    user.student.projectUrls = await this.insertUrls(projectUrls, user.student, ProjectUrl);
    user.student.portfolioUrls = await this.insertUrls(portfolioUrls, user.student, PortfolioUrl);

    await user.save();
    await user.student.save();

    return this.studentHelperService.filterStudent(user);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<UpdateStudentResponse> {
    if (!id) throw new BadRequestException();

    const {
      firstName,
      lastName,
      email,
      password,
      newPassword,
      projectUrls,
      portfolioUrls,
      ...studentDto
    } = updateStudentDto;

    const user = await this.getStudent({ id });
    if (!user || !user.student) throw new NotFoundException();

    if (
      updateStudentDto.githubUsername &&
      !(await this.studentHelperService.checkGithubExist(updateStudentDto.githubUsername))
    ) {
      throw new NotFoundException('Not found github account');
    }

    if (updateStudentDto.email && updateStudentDto.email === user.email) {
      await this.userHelperService.checkUserFieldUniquenessAndThrow({
        email: updateStudentDto.email,
      });
    }

    if (isNotEmpty(studentDto)) await Student.update({ id: user.student.id }, studentDto);

    if (updateStudentDto.newPassword || updateStudentDto.email) {
      if (updateStudentDto.password) {
        const hashCompareResult = await compare(password, user.hashPwd);

        if (hashCompareResult) {
          user.hashPwd = newPassword ? await hashPwd(newPassword) : user.hashPwd;

          user.email = updateStudentDto.email !== undefined ? email : user.email;
        } else throw new UnauthorizedException();
      } else throw new UnauthorizedException();
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;

    await user.student.reload();
    user.student.projectUrls =
      updateStudentDto.projectUrls !== undefined
        ? await this.updateProjectUrls(projectUrls, user.student)
        : user.student.projectUrls;

    user.student.portfolioUrls =
      updateStudentDto.portfolioUrls !== undefined
        ? await this.updatePortfolioUrls(portfolioUrls, user.student)
        : user.student.portfolioUrls;

    await user.save();
    await user.student.save();

    return this.studentHelperService.filterStudent(user);
  }

  async updateProjectUrls(urls: string[], student: Student): Promise<ProjectUrl[]> {
    await ProjectUrl.delete({ student: { id: student.id } });

    return this.insertUrls(urls, student, ProjectUrl);
  }

  async updatePortfolioUrls(urls: string[], student: Student): Promise<PortfolioUrl[]> {
    await PortfolioUrl.delete({ student: { id: student.id } });

    return this.insertUrls(urls, student, PortfolioUrl);
  }

  async changeStatus(
    id: string,
    changeStatusDto: ChangeStatusDto,
  ): Promise<ChangeStudentStatusResponse> {
    if (!id || (changeStatusDto.status === StudentStatus.AtInterview && !changeStatusDto.hrId)) {
      throw new BadRequestException();
    }

    const user = await this.getStudent({ id });
    if (!user) throw new NotFoundException();

    if (changeStatusDto.status === StudentStatus.AtInterview) {
      const hr = await this.hrService.getHr({ id: changeStatusDto.hrId });
      if (!hr) throw new NotFoundException();

      user.student.status = changeStatusDto.status;
      user.student.interviewWithHr = hr;
    } else {
      if (changeStatusDto.status === StudentStatus.Employed) {
        await this.notificationService.createNotification(
          `Kursant ${user.firstName} ${user.lastName} (${user.id}) został zatrudniony przez ${
            user.student.interviewWithHr?.firstName ?? ''
          } ${user.student.interviewWithHr?.lastName ?? ''} (${
            user.student.interviewWithHr?.id ?? 'nieznany'
          })`,
          id,
        );
      }

      user.student.status = changeStatusDto.status;
      user.student.interviewWithHr = null;
    }

    await user.student.save();

    return this.studentHelperService.filterStudent(user);
  }

  async insertUrls(
    urls: string[],
    student: Student,
    EntityClass: new () => ProjectUrl | PortfolioUrl | BonusProjectUrl,
  ): Promise<(BonusProjectUrl | ProjectUrl | PortfolioUrl)[]> {
    return await Promise.all(
      urls?.map(async (e) => {
        const urlEntity = new EntityClass();
        urlEntity.url = e;
        await urlEntity.save();

        urlEntity.student = student;
        await urlEntity.save();

        return urlEntity;
      }) ?? [],
    );
  }

  async getStudent(where: { [key: string]: any }): Promise<User> {
    return User.findOne({
      where,
      relations: [
        'student',
        'student.bonusProjectUrls',
        'student.portfolioUrls',
        'student.projectUrls',
        'student.interviewWithHr',
      ],
    });
  }
}
