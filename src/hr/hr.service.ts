import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { UserService } from '../user/user.service';
import { UserHelperService } from '../user/user-helper.service';
import { Hr } from './entities/hr.entity';
import { User } from '../user/entities/user.entity';
import { CompletionSignupHrResponse, CreateHrResponse, UserInterface, UserRole } from '../types';
import { v4 as uuid } from 'uuid';
import { MailService } from '../common/providers/mail/mail.service';
import { config } from '../config/config';
import { HrHelperService } from './hr-helper.service';
import { hashPwd } from '../common/utils/hashPwd';
import { StudentHelperService } from '../student/student-helper.service';

@Injectable()
export class HrService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => UserHelperService)) private userHelperService: UserHelperService,
    @Inject(forwardRef(() => HrHelperService)) private hrHelperService: HrHelperService,
    @Inject(forwardRef(() => StudentHelperService))
    private studentHelperService: StudentHelperService,
    @Inject(MailService) private mailService: MailService,
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
    user.userTokenExpiredAt = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 14);
    await user.save();

    user.hr = hr;
    hr.user = user;
    await user.save();
    await hr.save();

    await this.mailService.sendHrSignupEmail(user.email, {
      signupUrl: `${config.feUrl}/signup/hr/${user.userToken}`,
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
    if (user.userTokenExpiredAt < new Date()) throw new ForbiddenException();

    user.hashPwd = await hashPwd(newPassword);
    user.isActive = true;
    user.userToken = null;
    user.userTokenExpiredAt = null;
    await user.save();

    return this.hrHelperService.filterHr(user);
  }

  async getHr(where: Partial<UserInterface>): Promise<User> {
    return User.findOne({
      where: {
        ...where,
        role: UserRole.Student,
      },
      relations: ['hr'],
    });
  }
}
