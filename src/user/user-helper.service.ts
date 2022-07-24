import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UrlInterface, UrlResponse, UserResponse } from '../types';
import fetch from 'node-fetch';

@Injectable()
export class UserHelperService {
  async checkUserFieldUniqueness(value: { [key: string]: any }): Promise<boolean> {
    const user = await User.findOne({
      where: value,
    });

    return !user;
  }

  async checkUserFieldUniquenessAndThrow(value: { [key: string]: any }) {
    const fieldUniqueness = this.checkUserFieldUniqueness(value);

    if (!fieldUniqueness) throw new ConflictException();
  }
}
