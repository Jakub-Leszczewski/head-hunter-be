import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import {
  ContractType,
  UserResponse,
  CreateStudentsResponse,
  UrlInterface,
  UrlResponse,
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
import fetch from 'node-fetch';

@Injectable()
export class StudentService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  async studentsImport(createStudentDto: CreateStudentDto[]): Promise<CreateStudentsResponse> {
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

    return studentResponse.map((e) => this.filterStudent(e));
  }

  async completeSignup(
    userToken: string,
    signupCompletionStudentDto: SignupCompletionStudentDto,
  ): Promise<SignupCompleteStudentsResponse> {
    if (!userToken) throw new BadRequestException();

    const user = await User.findOne({
      where: { userToken },
      relations: ['student'],
    });
    if (!user || !user.student) throw new NotFoundException();

    if (signupCompletionStudentDto.email && signupCompletionStudentDto.email === user.email) {
      await this.userService.checkUserFieldUniquenessAndThrow({
        email: signupCompletionStudentDto.email,
      });
    }

    if (!(await this.checkGithubUsernameExist(signupCompletionStudentDto.githubUsername)))
      throw new NotFoundException('Not found github account');

    user.firstName = signupCompletionStudentDto.firstName;
    user.lastName = signupCompletionStudentDto.lastName;
    user.email = signupCompletionStudentDto.email ?? user.email;
    user.hashPwd = await hashPwd(signupCompletionStudentDto.password);
    user.isActive = true;
    user.userToken = null;

    user.student.githubUsername = signupCompletionStudentDto.githubUsername;
    user.student.bio = signupCompletionStudentDto.bio || null;
    user.student.phoneNumber = signupCompletionStudentDto.phoneNumber || null;
    user.student.education = signupCompletionStudentDto.education || null;
    user.student.courses = signupCompletionStudentDto.courses;
    user.student.monthsOfCommercialExp = signupCompletionStudentDto.monthsOfCommercialExp;
    user.student.workExperience = signupCompletionStudentDto.workExperience || null;
    user.student.targetWorkCity = signupCompletionStudentDto.targetWorkCity || null;
    user.student.expectedSalary = signupCompletionStudentDto.expectedSalary || null;
    user.student.expectedContractType =
      signupCompletionStudentDto.expectedContractType || ContractType.Irrelevant;
    user.student.expectedTypeWork =
      signupCompletionStudentDto.expectedTypeWork || WorkType.Irrelevant;
    user.student.canTakeApprenticeship = signupCompletionStudentDto.canTakeApprenticeship;
    user.student.projectUrls = await this.insertUrls(
      signupCompletionStudentDto.projectUrls,
      user.student,
      ProjectUrl,
    );
    user.student.portfolioUrls = await this.insertUrls(
      signupCompletionStudentDto.portfolioUrls,
      user.student,
      PortfolioUrl,
    );

    await user.save();
    await user.student.save();

    return this.filterStudent(user);
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

  async checkGithubUsernameExist(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}`);

    return res.status === 200;
  }

  filterUrl(url: UrlInterface[]): UrlResponse[] {
    return (
      url?.map((e) => {
        const { student, ...urlResponse } = e;
        return urlResponse;
      }) ?? []
    );
  }

  //@TODO if will create hr table, this function must remove it
  filterStudent(user: User): UserResponse {
    const { hashPwd, userToken, student, ...userResponse } = user;
    const { bonusProjectUrls, portfolioUrls, projectUrls, ...studentResponse } = student;

    const newBonusProjectUrls = this.filterUrl(bonusProjectUrls);
    const newPortfolioUrls = this.filterUrl(portfolioUrls);
    const newProjectUrls = this.filterUrl(projectUrls);

    return {
      ...userResponse,
      student: {
        ...studentResponse,
        bonusProjectUrls: newBonusProjectUrls ? [...newBonusProjectUrls] : null,
        portfolioUrls: newPortfolioUrls ? [...newPortfolioUrls] : null,
        projectUrls: newProjectUrls ? [...newProjectUrls] : null,
      },
    };
  }
}
