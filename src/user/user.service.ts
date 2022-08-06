import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserHelperService } from './user-helper.service';
import { GetUserResponse } from '../types/user/user-response';

@Injectable()
export class UserService {
  constructor(private userHelperService: UserHelperService) {}

  async findOne(id: string): Promise<GetUserResponse> {
    if (!id) throw new BadRequestException();

    const user = await User.findOne({
      where: { id },
      relations: ['student', 'hr'],
    });
    if (!user) throw new NotFoundException();

    return this.userHelperService.filterUserByRole(user);
  }
}
