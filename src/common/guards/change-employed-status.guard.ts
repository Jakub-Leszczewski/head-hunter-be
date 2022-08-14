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
import { Interview } from '../../hr/entities/interview.entity';

@Injectable()
export class ChangeEmployedStatusGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private reflector: Reflector,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const user = request.user as User;
    const ownerId = request.params?.id;
    const roles = this.reflector.get<string[]>('auth_role', handler);

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    if (user.id === ownerId || roles?.includes(user.role)) return true;
    else if (user.role === UserRole.Hr) {
      const interview = await Interview.findOne({
        where: {
          hr: { id: user.id },
          student: { id: ownerId },
        },
      });

      return !!interview;
    }

    return false;
  }
}
