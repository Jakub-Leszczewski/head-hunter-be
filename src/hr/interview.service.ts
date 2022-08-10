import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { StudentStatus, UserRole } from '../types';
import { Interview } from './entities/interview.entity';
import { config } from '../config/config';
import { StudentHelperService } from '../student/student-helper.service';
import { ChangeStatusInterviewDto } from './dto/change-status-interview.dto';

@Injectable()
export class InterviewService {
  constructor(private studentHelperService: StudentHelperService) {}

  async findAllHrInterview(id: string, query) {
    const { search, sortBy, sortMethod, page } = query;

    const [result, totalEntitiesCount] = await this.studentHelperService
      .findAllStudentsQb(
        this.studentHelperService.statusStudentQbCondition([StudentStatus.Available]),
        this.studentHelperService.filterStudentQbCondition(query),
        this.studentHelperService.searchStudentByNameQbCondition(search),
        this.studentHelperService.interviewWithHrStudentQbCondition(id),
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

  async createInterview(id: string, { hrId }: ChangeStatusInterviewDto) {
    if (!hrId || !id) throw new BadRequestException();
    await this.checkInterviewExistAndThrow(id, hrId);

    const student = await User.findOne({
      where: {
        id: id,
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
      relations: ['hr'],
    });
    if (!hr) throw new NotFoundException();

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

  async removeInterview(id: string, { hrId }: ChangeStatusInterviewDto) {
    if (!id) throw new BadRequestException();

    const interview = await Interview.findOne({
      where: {
        student: { id: id },
        hr: { id: hrId },
      },
      relations: ['hr', 'student'],
    });
    if (!interview) throw new NotFoundException();

    await interview.remove();

    return {
      hrId: interview.hr.id,
      studentId: interview.student.id,
      expiredAt: interview.expiredAt,
    };
  }

  async checkInterviewExist(studentId: string, hrId: string): Promise<boolean> {
    if (!studentId || !hrId) throw new Error('studentId or hrId is empty');

    const interview = await Interview.findOne({
      where: {
        hr: { id: hrId },
        student: { id: studentId },
      },
    });

    return !!interview;
  }

  async checkInterviewExistAndThrow(studentId: string, hrId: string) {
    const interviewExist = await this.checkInterviewExist(studentId, hrId);

    if (interviewExist) throw new ConflictException();
  }
}
