import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  ContractType,
  CreateStudentResponse,
  CreateStudentsResponse,
  UrlInterface,
  UrlResponse,
  UserRole,
  WorkType,
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

@Injectable()
export class StudentService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async studentsImport(
    createStudentDto: CreateStudentDto[],
  ): Promise<CreateStudentsResponse> {
    const studentResponse: any = [];
    for await (const studentDto of createStudentDto) {
      const emailUniqueness = await this.userService.checkUserFieldUniqueness({
        email: studentDto.email,
      });

      if (emailUniqueness) {
        const student = new Student();
        student.courseCompletion = studentDto.courseCompletion;
        student.courseEngagement = studentDto.courseEngagement;
        student.projectDegree = studentDto.projectDegree;
        student.teamProjectDegree = studentDto.teamProjectDegree;
        student.courseCompletion = studentDto.courseCompletion;
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

    return studentResponse.map((e) => this.filter(e));
  }

  async completeSignup(
    userToken: string,
    updateUserDto: SignupCompletionStudentDto,
  ) {
    if (!userToken) throw new BadRequestException();

    await this.userService.checkUserFieldUniquenessAndThrow({
      email: updateUserDto.email,
    });

    const user = await User.findOne({
      where: { userToken },
    });
    if (!user) throw new NotFoundException();

    const student = await Student.findOne({
      where: {
        user: { id: user.id },
      },
    });
    if (!student) throw new NotFoundException();

    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    user.hashPwd = await hashPwd(updateUserDto.password);
    await user.save();

    student.githubUsername = updateUserDto.githubUsername;
    student.bio = updateUserDto.bio || null;
    student.phoneNumber = updateUserDto.phoneNumber || null;
    student.education = updateUserDto.education || null;
    student.courses = updateUserDto.githubUsername;
    student.monthsOfCommercialExp = updateUserDto.monthsOfCommercialExp;
    student.workExperience = updateUserDto.workExperience || null;
    student.targetWorkCity = updateUserDto.targetWorkCity || null;
    student.expectedSalary = updateUserDto.expectedSalary || null;
    student.expectedContractType =
      updateUserDto.expectedContractType || ContractType.Irrelevant;
    student.expectedTypeWork =
      updateUserDto.expectedTypeWork || WorkType.Irrelevant;
    student.canTakeApprenticeship =
      updateUserDto.canTakeApprenticeship || false;
    student.projectUrls = await this.insertUrls(
      updateUserDto.projectUrls,
      student,
      ProjectUrl,
    );
    student.portfolioUrls = await this.insertUrls(
      updateUserDto.portfolioUrls,
      student,
      PortfolioUrl,
    );
    await student.save();
  }

  async insertUrls(
    urls: string[],
    student: Student,
    EntityClass: new () => ProjectUrl | PortfolioUrl | BonusProjectUrl,
  ) {
    return await Promise.all(
      urls.map(async (e) => {
        const urlEntity = new EntityClass();
        urlEntity.url = e;
        await urlEntity.save();

        urlEntity.student = student;
        await urlEntity.save();

        return urlEntity;
      }),
    );
  }

  filterUrl(url: UrlInterface[]): UrlResponse[] {
    return url.map((e) => {
      const { student, ...urlResponse } = e;
      return urlResponse;
    });
  }

  //@TODO if will create hr table, this function must remove it
  filter(user: User): CreateStudentResponse {
    const { hashPwd, userToken, student, ...userResponse } = user;
    const { bonusProjectUrls, portfolioUrls, projectUrls, ...studentResponse } =
      student;

    const newBonusProjectUrls = this.filterUrl(bonusProjectUrls);
    const newPortfolioUrls = this.filterUrl(portfolioUrls);
    const newProjectUrls = this.filterUrl(projectUrls);

    return {
      ...userResponse,
      student: {
        ...studentResponse,
        bonusProjectUrls: [...newBonusProjectUrls],
        portfolioUrls: [...newPortfolioUrls],
        projectUrls: [...newProjectUrls],
      },
    };
  }
}
