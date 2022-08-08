import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserResponseAllData, OnlyUserResponseData, UserResponseData, UserRole } from '../types';
import { StudentHelperService } from '../student/student-helper.service';
import { HrHelperService } from '../hr/hr-helper.service';

@Injectable()
export class UserHelperService {
  constructor(
    @Inject(forwardRef(() => StudentHelperService))
    private studentHelperService: StudentHelperService,
    @Inject(forwardRef(() => HrHelperService)) private hrHelperService: HrHelperService,
  ) {}

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
    const { jwtId, hashPwd, userToken, userTokenExpiredAt, ...userResponse } = userEntity;

    return userResponse;
  }

  filterOnlyUser(userEntity: User): OnlyUserResponseData {
    const { student, hr, ...userResponse } = this.filter(userEntity);

    return userResponse;
  }

  filterUserByRole(userEntity: User): UserResponseAllData {
    switch (userEntity.role) {
      case UserRole.Admin: {
        return this.filterOnlyUser(userEntity);
      }
      case UserRole.Student: {
        return this.studentHelperService.filterStudent(userEntity);
      }
      case UserRole.Hr: {
        return this.hrHelperService.filterHr(userEntity);
      }
      default: {
        throw new Error('user role is empty');
      }
    }
  }
}
