import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { OnlyUserResponseData, UserResponseData } from '../types';

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

  filter(userEntity: User): UserResponseData {
    const { jwtId, hashPwd, userToken, ...userResponse } = userEntity;

    return userResponse;
  }

  filterOnlyUser(userEntity: User): OnlyUserResponseData {
    const { student, hr, ...userResponse } = this.filter(userEntity);

    return userResponse;
  }
}
