import { Injectable, CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const user = request.user as User;
    const roles = this.reflector.get<string[]>('auth_role', handler);

    if (!user) throw new Error('User is undefined');

    return roles.includes(user.role);
  }
}
