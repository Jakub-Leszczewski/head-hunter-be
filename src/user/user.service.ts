import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserRole } from '../types';
import { UserHelperService } from './user-helper.service';
import { StudentHelperService } from '../student/student-helper.service';
import { HrHelperService } from '../hr/hr-helper.service';

@Injectable()
export class UserService {
  constructor(
    private userHelperService: UserHelperService,
    private studentHelperService: StudentHelperService,
    private hrHelperService: HrHelperService,
  ) {}

  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: string) {
    if (!id) throw new BadRequestException();

    const user = await User.findOne({
      where: { id },
      relations: ['student', 'hr'],
    });
    if (!user) throw new NotFoundException();

    switch (user.role) {
      case UserRole.Admin: {
        return this.userHelperService.filterOnlyUser(user);
      }
      case UserRole.Student: {
        return this.studentHelperService.filterStudent(user);
      }
      case UserRole.Hr: {
        return this.hrHelperService.filterHr(user);
      }
      default: {
        throw new Error('user role is empty');
      }
    }
  }

  update(id: number, updateUserDto: any) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
