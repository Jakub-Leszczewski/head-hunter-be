import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserHelperService } from '../user/user-helper.service';
import { User } from '../user/entities/user.entity';
import { HrResponse } from '../types';

@Injectable()
export class HrHelperService {
  constructor(
    @Inject(forwardRef(() => UserHelperService)) private userHelperService: UserHelperService,
  ) {}

  filterHr(userEntity: User): HrResponse {
    const { hr, student, ...userResponse } = this.userHelperService.filter(userEntity);
    const { user, ...hrResponse } = hr;

    return {
      ...userResponse,
      hr: { ...hrResponse },
    };
  }
}
