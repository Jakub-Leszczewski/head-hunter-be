import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { StudentStatus, UserRole } from '../types';
import { Interview } from './entities/interview.entity';

@Injectable()
export class InterviewService {
  async findAllHrInterview(id: string) {}

  async createInterview(hrId: string, studentId: string) {
    if (!hrId || !studentId) throw new BadRequestException();

    const interviewCount = await Interview.count({
      where: {
        hr: { id: hrId },
      },
    });

    const student = await User.findOne({
      where: {
        id: studentId,
        role: UserRole.Student,
        student: { status: StudentStatus.Available },
      },
    });
    if (!student) throw new NotFoundException();

    const hr = await User.findOne({
      where: {
        id: hrId,
        role: UserRole.Hr,
      },
    });

    if (!hr) throw new NotFoundException();
    if (hr.hr.maxReservedStudents >= interviewCount) throw new ForbiddenException();

    const interview = new Interview();
    interview.student = student;
    interview.hr = hr;
    interview.expiredAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 10);
    await interview.save();

    return {
      id: interview.id,
      hrId: interview.hr.id,
      studentId: interview.student.id,
      expiredAt: interview.expiredAt,
    };
  }
}
