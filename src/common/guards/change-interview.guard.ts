import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { DataSource } from 'typeorm';
import { UserRole } from '../../types';
import { ChangeStatusInterviewDto } from '../../hr/dto/change-status-interview.dto';

@Injectable()
export class ChangeInterviewGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const user = request.user as User;
    const ownerId = request.params?.id;
    const body: ChangeStatusInterviewDto = request.body;
    const roles = this.reflector.get<string[]>('auth_role', handler);

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    if ((user.role === UserRole.Hr && user.id === body.hrId) || roles.includes(user.role))
      return true;
  }
}
