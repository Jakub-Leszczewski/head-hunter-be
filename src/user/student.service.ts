import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import {
  CreateStudentResponse,
  CreateStudentsResponse,
  UserRole,
} from '../types';
import { UserService } from './user.service';
import { Student } from './entities/student.entity';
import { BonusProjectUrl } from './entities/bonus-project-url.entity';
import { User } from './entities/user.entity';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { config } from '../config/config';

@Injectable()
export class StudentService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  //@TODO change types, create user entity interface
  async create(
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

        student.bonusProjectUrls = await Promise.all(
          studentDto.bonusProjectUrls.map(async (e) => {
            const bonusProjectUrl = new BonusProjectUrl();
            bonusProjectUrl.url = e;
            await bonusProjectUrl.save();

            bonusProjectUrl.student = student;
            await bonusProjectUrl.save();

            return bonusProjectUrl;
          }),
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

  completeSignup(number: number, updateUserDto: UpdateStudentDto) {}

  //@TODO if will create hr table, this function must remove it
  filter(user: User): CreateStudentResponse {
    const { hashPwd, userToken, student, ...userResponse } = user;
    const { bonusProjectUrls, ...studentResponse } = student;
    const newBonusProjectUrls = bonusProjectUrls.map((e) => {
      const { student, ...bonusProjectUrl } = e;
      return bonusProjectUrl;
    });

    return {
      ...userResponse,
      student: {
        ...studentResponse,
        bonusProjectUrls: [...newBonusProjectUrls],
      },
    };
  }
}
