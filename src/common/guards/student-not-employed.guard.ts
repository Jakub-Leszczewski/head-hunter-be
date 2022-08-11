import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { StudentStatus } from '../../types';

@Injectable()
export class StudentNotEmployedGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const ownerId = request.params?.id;

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    const { student } = await User.findOne({
      where: { id: ownerId },
      relations: ['student'],
    });

    return student.status !== StudentStatus.Employed;
  }
}
