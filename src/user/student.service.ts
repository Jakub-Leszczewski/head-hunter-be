import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import {
  ContractType,
  CreateStudentsResponse,
  UserRole,
  WorkType,
  SignupCompleteStudentsResponse,
} from '../types';
import { UserService } from './user.service';
import { Student } from './entities/student.entity';
import { BonusProjectUrl } from './entities/bonus-project-url.entity';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { config } from '../config/config';
import { hashPwd } from '../utils/hashPwd';
import { ProjectUrl } from './entities/project-url.entity';
import { PortfolioUrl } from './entities/portfolio-url.entity';
import { SignupCompletionStudentDto } from './dto/signup-completion-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { compare } from 'bcrypt';
import { DataSource } from 'typeorm';
import { isNotEmpty } from '../utils/check-object';
import { UserHelperService } from './user-helper.service';

@Injectable()
export class StudentService {
  constructor(
    private readonly userService: UserService,
    private readonly userHelperService: UserHelperService,
    private readonly mailService: MailService,
    private readonly dataSource: DataSource,
  ) {}

  async importStudents(createStudentDto: CreateStudentDto[]): Promise<CreateStudentsResponse> {
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
        student.canTakeApprenticeship = false;
        student.monthsOfCommercialExp = 0;
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
        await user.save();

        user.student = student;
        await user.save();

        studentResponse.push(user);

        await this.mailService.sendStudentSignupEmail(user.email, {
          signupUrl: `${config.feUrl}/signup/student/${user.id}/${user.userToken}`,
          courseCompletion: student.courseCompletion,
          courseEngagement: student.courseEngagement,
          projectDegree: student.projectDegree,
          teamProjectDegree: student.teamProjectDegree,
        });
      }
    }

    return studentResponse.map((e) => this.userHelperService.filterStudent(e));
  }

  async completeSignup(
    userToken: string,
    signupCompletionStudentDto: SignupCompletionStudentDto,
  ): Promise<SignupCompleteStudentsResponse> {
    if (!userToken) throw new BadRequestException();

    const {
      firstName,
      lastName,
      email,
      password,
      newPassword,
      projectUrls,
      portfolioUrls,
      ...studentDto
    } = signupCompletionStudentDto;

    const userAndStudentSimpleInfo = await this.dataSource
      .createQueryBuilder()
      .select(['user.id', 'user.isActive', 'student.id'])
      .from(User, 'user')
      .leftJoin('user.student', 'student')
      .where('user.userToken =:userToken', { userToken })
      .getOne();

    if (!userAndStudentSimpleInfo || !userAndStudentSimpleInfo.student)
      throw new NotFoundException();
    if (userAndStudentSimpleInfo.isActive) throw new ForbiddenException();

    if (isNotEmpty(studentDto))
      await Student.update({ id: userAndStudentSimpleInfo.student.id }, studentDto);

    const user = await User.findOne({
      where: { userToken },
      relations: [
        'student',
        'student.bonusProjectUrls',
        'student.portfolioUrls',
        'student.projectUrls',
      ],
    });

    if (!user || !user.student) throw new NotFoundException();
    if (signupCompletionStudentDto.email && signupCompletionStudentDto.email === user.email) {
      await this.userHelperService.checkUserFieldUniquenessAndThrow({
        email: signupCompletionStudentDto.email,
      });
    }

    if (
      !(await this.userHelperService.checkGithubUsernameExist(
        signupCompletionStudentDto.githubUsername,
      ))
    )
      throw new NotFoundException('Not found github account');

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email ?? user.email;
    user.hashPwd = await hashPwd(newPassword);
    user.isActive = true;
    user.userToken = null;

    user.student.projectUrls = await this.insertUrls(projectUrls, user.student, ProjectUrl);
    user.student.portfolioUrls = await this.insertUrls(portfolioUrls, user.student, PortfolioUrl);

    await user.save();
    await user.student.save();

    return this.userHelperService.filterStudent(user);
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
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

    const userAndStudentIds = await this.dataSource
      .createQueryBuilder()
      .select(['user.id', 'student.id'])
      .from(User, 'user')
      .leftJoin('user.student', 'student')
      .where('user.id =:id', { id })
      .getOne();

    if (!userAndStudentIds || !userAndStudentIds.student) throw new NotFoundException();

    if (isNotEmpty(studentDto))
      await Student.update({ id: userAndStudentIds.student.id }, studentDto);

    const user = await User.findOne({
      where: { id },
      relations: [
        'student',
        'student.bonusProjectUrls',
        'student.portfolioUrls',
        'student.projectUrls',
      ],
    });

    if (!user || !user.student) throw new NotFoundException();

    if (updateStudentDto.email && updateStudentDto.email === user.email) {
      await this.userHelperService.checkUserFieldUniquenessAndThrow({
        email: updateStudentDto.email,
      });
    }

    if (
      updateStudentDto.githubUsername &&
      updateStudentDto.githubUsername !== user.student.githubUsername &&
      !(await this.userHelperService.checkGithubUsernameExist(updateStudentDto.githubUsername))
    )
      throw new NotFoundException('Not found github account');

    if (updateStudentDto.newPassword || updateStudentDto.email) {
      if (updateStudentDto.password) {
        const hashCompareResult = await compare(updateStudentDto.password, user.hashPwd);

        if (hashCompareResult) {
          user.hashPwd = newPassword ? await hashPwd(newPassword) : user.hashPwd;

          user.email = updateStudentDto.email !== undefined ? email : user.email;
        } else throw new UnauthorizedException();
      } else throw new UnauthorizedException();
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;

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

    return this.userHelperService.filterStudent(user);
  }

  async updateProjectUrls(urls: string[], student: Student) {
    await ProjectUrl.delete({ student: { id: student.id } });

    return this.insertUrls(urls, student, ProjectUrl);
  }

  async updatePortfolioUrls(urls: string[], student: Student) {
    await PortfolioUrl.delete({ student: { id: student.id } });

    return this.insertUrls(urls, student, PortfolioUrl);
  }

  async insertUrls(
    urls: string[],
    student: Student,
    EntityClass: new () => ProjectUrl | PortfolioUrl | BonusProjectUrl,
  ) {
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
}
