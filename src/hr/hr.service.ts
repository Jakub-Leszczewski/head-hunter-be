import { Injectable } from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
import { UserService } from '../user/user.service';
import { UserHelperService } from '../user/user-helper.service';
import { Hr } from './entities/hr.entity';
import { User } from '../user/entities/user.entity';
import { UserRole } from '../types';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { config } from '../config/config';
import { HrHelperService } from './hr-helper.service';

@Injectable()
export class HrService {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
    private hrHelperService: HrHelperService,
    private mailService: MailService,
  ) {}

  async create(createHrDto: CreateHrDto) {
    await this.userHelperService.checkUserFieldUniquenessAndThrow({
      email: createHrDto.email,
    });

    const hr = new Hr();
    hr.company = createHrDto.company;
    hr.maxReservedStudents = createHrDto.maxReservedStudents;
    await hr.save();

    const user = new User();
    user.email = createHrDto.email;
    user.firstName = createHrDto.firstName;
    user.lastName = createHrDto.lastName;
    user.role = UserRole.Hr;
    user.isActive = false;
    user.userToken = uuid();
    await user.save();

    user.hr = hr;
    await user.save();

    await this.mailService.sendHrSignupEmail(user.email, {
      signupUrl: `${config.feUrl}/signup/hr/${user.id}/${user.userToken}`,
    });

    return this.hrHelperService.filterHr(user);
  }

  findAll() {
    return `This action returns all hr`;
  }

  findOne(id: number) {
    return `This action returns a #${id} hr`;
  }

  update(id: number, updateHrDto: UpdateHrDto) {
    return `This action updates a #${id} hr`;
  }

  remove(id: number) {
    return `This action removes a #${id} hr`;
  }
}
