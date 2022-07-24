import { Injectable } from '@nestjs/common';
import { CreateHrDto } from './dto/create-hr.dto';
import { UpdateHrDto } from './dto/update-hr.dto';
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
  filterHr(user: User): HrResponse {
    const { hashPwd, userToken, hr, student, ...userResponse } = user;
    const { user: userData, ...hrResponse } = hr;

    return {
      ...userResponse,
      hr: { ...hrResponse },
    };
  }
}
