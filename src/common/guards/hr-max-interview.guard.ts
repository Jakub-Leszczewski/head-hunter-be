import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';
import { UserRole } from '../../types';
import { Interview } from '../../hr/entities/interview.entity';

@Injectable()
export class HrMaxInterviewGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user as User;
    const ownerId = request.params?.id;

    if (!ownerId) throw new BadRequestException();
    if (!user) throw new Error('User is undefined');

    const interviewCount = await Interview.count({
      where: {
        hr: { id: user.id },
      },
    });

    const hr = await User.findOne({
      where: {
        id: user.id,
        role: UserRole.Hr,
      },
      relations: ['hr'],
    });
    if (!hr) throw new NotFoundException();

    if (hr.hr?.maxReservedStudents > interviewCount) return true;
  }
}
