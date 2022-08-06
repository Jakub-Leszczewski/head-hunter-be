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
import { CompletionSignupHrResponse, CreateHrResponse, StudentStatus, UserRole } from '../types';
import { v4 as uuid } from 'uuid';
import { MailService } from '../common/providers/mail/mail.service';
import { config } from '../config/config';
import { HrHelperService } from './hr-helper.service';
import { hashPwd } from '../common/utils/hashPwd';
import { StudentHelperService } from '../student/student-helper.service';
import { FindAllQueryDto } from '../student/dto/find-all-query.dto';

@Injectable()
export class HrService {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
    private studentHelperService: StudentHelperService,
    private hrHelperService: HrHelperService,
    private mailService: MailService,
  ) {}

  async findStudentsAtInterview(id: string, query: FindAllQueryDto) {
    const { search, sortBy, sortMethod, page } = query;

    const [result, totalEntitiesCount] = await this.studentHelperService
      .findAllStudentsQb(
        this.studentHelperService.statusStudentQbCondition([StudentStatus.AtInterview]),
        this.studentHelperService.filterStudentQbCondition(query),
        this.studentHelperService.searchStudentQbCondition(search),
        this.studentHelperService.interviewWithHrStudentQbCondition(id),
        this.studentHelperService.orderByStudentQbCondition(sortBy, sortMethod),
        this.studentHelperService.paginationStudentQbCondition(page, config.maxItemsOnPage),
      )
      .getManyAndCount();

    return {
      result: result.map((e) => this.studentHelperService.filterSmallStudent(e)),
      totalEntitiesCount,
      totalPages: Math.ceil(totalEntitiesCount / config.maxItemsOnPage),
    };
  }

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
    await user.save();

    return this.hrHelperService.filterHr(user);
  }

  async getHr(where: { [key: string]: any }): Promise<User> {
    return User.findOne({
      where,
      relations: ['hr'],
    });
  }
}
