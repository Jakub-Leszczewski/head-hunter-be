import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { UserService } from '../user/user.service';
import { UserHelperService } from '../user/user-helper.service';
import { Hr } from './entities/hr.entity';
import { User } from '../user/entities/user.entity';
import { CompletionSignupHrResponse, CreateHrResponse, UserRole } from '../types';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { config } from '../config/config';
import { HrHelperService } from './hr-helper.service';
import { hashPwd } from '../utils/hashPwd';

@Injectable()
export class HrService {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
    private hrHelperService: HrHelperService,
    private mailService: MailService,
  ) {}

  async importHr(createHrDto: CreateHrDto): Promise<CreateHrResponse> {
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

  async completeSignup(
    userToken: string,
    { newPassword }: CompletionHrDto,
  ): Promise<CompletionSignupHrResponse> {
    if (!userToken) throw new BadRequestException();

    const user = await this.getHr({ userToken });
    if (!user || !user.hr) throw new NotFoundException();
    if (user.isActive) throw new ForbiddenException();

    user.hashPwd = await hashPwd(newPassword);
    user.isActive = true;
    user.userToken = null;

    return this.hrHelperService.filterHr(user);
  }

  async getHr(where: { [key: string]: any }): Promise<User> {
    return User.findOne({
      where,
      relations: ['hr'],
    });
  }
}
