import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { StudentStatus, UserRole } from '../../types';
import { ChangeStatusInterviewDto } from '../../student/dto/change-status-interview.dto';

@Injectable()
export class ChangeStudentStatusGuard implements CanActivate {
  constructor(private reflector: Reflector, private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const user = request.user as User;
    const ownerId = request.params?.id;
    const body: ChangeStatusInterviewDto = request.body;
    const roles = this.reflector.get<string[]>('auth_role', handler);

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    const userStudent = await this.dataSource
      .createQueryBuilder()
      .select(['user.id', 'student.id', 'student.status', 'interviewWithHr.id'])
      .from(User, 'user')
      .leftJoin('user.student', 'student')
      .leftJoin('student.interviewWithHr', 'interviewWithHr')
      .where('user.id=:ownerId', { ownerId })
      .getOne();

    if (!userStudent) throw new NotFoundException();
    if (!userStudent.student) throw new Error(`Student is undefined in user: ${userStudent.id}`);

    const { student } = userStudent;
    //@TODO zaktualizować guarda
    return true;
    // return (
    //   roles?.includes(user.role) ||
    //   (body.status === StudentStatus.Employed && ownerId === user.id) ||
    //   (student.status === StudentStatus.AtInterview && student.interviewWithHr.id === user.id) ||
    //   (student.status === StudentStatus.Available &&
    //     body.status === StudentStatus.AtInterview &&
    //     user.role === UserRole.Hr &&
    //     body.hrId === user.id)
    // );
  }
}
