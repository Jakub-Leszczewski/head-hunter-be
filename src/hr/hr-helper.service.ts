import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserHelperService } from '../user/user-helper.service';
import { User } from '../user/entities/user.entity';
import { HrResponse, UserRole } from '../types';

@Injectable()
export class HrHelperService {
  constructor(
    @Inject(forwardRef(() => UserHelperService)) private userHelperService: UserHelperService,
  ) {}

  filterHr(userEntity: User): HrResponse {
    const { hr, student, ...userResponse } = this.userHelperService.filter(userEntity);
    const { user, id, ...hrResponse } = hr;

    return {
      ...userResponse,
      role: UserRole.Hr,
      hr: { ...hrResponse },
    };
  }
}
