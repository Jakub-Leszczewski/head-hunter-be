import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UserHelperService {
  async checkUserFieldUniqueness(value: { [key: string]: any }): Promise<boolean> {
    const user = await User.findOne({
      where: value,
    });

    return !user;
  }

  async checkUserFieldUniquenessAndThrow(value: { [key: string]: any }) {
    const fieldUniqueness = await this.checkUserFieldUniqueness(value);

    if (!fieldUniqueness) throw new ConflictException();
  }
}
