import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

@Injectable()
export class OnlyActiveUserGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const ownerId = request.params?.id;

    if (!ownerId) throw new BadRequestException();

    const user = await User.findOne({
      where: { id: ownerId },
      select: ['isActive'],
    });
    if (!user) throw new NotFoundException();

    return user.isActive;
  }
}
