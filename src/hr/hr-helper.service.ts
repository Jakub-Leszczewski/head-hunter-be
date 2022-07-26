import { Injectable } from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { CompletionHrDto } from './dto/completion-hr.dto';
import { UserService } from '../user/user.service';
import { UserHelperService } from '../user/user-helper.service';
import { Hr } from './entities/hr.entity';
import { User } from '../user/entities/user.entity';
import { HrResponse, StudentResponse, UserRole } from '../types';
import { v4 as uuid } from 'uuid';
import { MailService } from '../mail/mail.service';
import { config } from '../config/config';

@Injectable()
export class HrHelperService {
  constructor(private userHelperService: UserHelperService) {}

  filterHr(userEntity: User): HrResponse {
    const { hr, student, ...userResponse } = this.userHelperService.filter(userEntity);
    const { user, ...hrResponse } = hr;

    return {
      ...userResponse,
      hr: { ...hrResponse },
    };
  }
}
