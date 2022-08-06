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
import { StudentStatus } from '../../types';

@Injectable()
export class ChangeStudentStatusGuard implements CanActivate {
  constructor(private reflector: Reflector, private dataSource: DataSource) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const ownerId = request.params?.id;

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    const { student } = await this.dataSource
      .createQueryBuilder()
      .select(['user.id', 'student.id', 'student.status', 'interviewWithHr.id'])
      .from(User, 'user')
      .leftJoin('user.student', 'student')
      .leftJoin('student.interviewWithHr', 'interviewWithHr')
      .where('user.id=:ownerId', { ownerId })
      .getOne();

    if (!student) throw new NotFoundException();

    console.log(student, student.status, StudentStatus.Available);
    if (
      user.id === ownerId ||
      user.id === student.interviewWithHr?.id ||
      student.status === StudentStatus.Available
    )
      return true;

    return false;
  }
}
