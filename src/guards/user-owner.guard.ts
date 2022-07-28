import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const user = request.user as User;
    const ownerId = request.params?.id;
    const roles = this.reflector.get<string[]>('auth_role', handler);

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    return user.id === ownerId || roles.includes(user.role);
  }
}
