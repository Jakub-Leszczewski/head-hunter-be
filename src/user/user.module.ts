import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StudentService } from './student.service';
import { HrService } from './hr.service';
import { MailModule } from '../mail/mail.module';
import { UserHelperService } from './user-helper.service';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService, StudentService, HrService, UserHelperService],
})
export class UserModule {}
