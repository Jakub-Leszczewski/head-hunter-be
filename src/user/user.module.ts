import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { UserHelperService } from './user-helper.service';
import { StudentModule } from '../student/student.module';
import { HrModule } from '../hr/hr.module';

@Module({
  imports: [MailModule, forwardRef(() => StudentModule), forwardRef(() => HrModule)],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService, UserHelperService],
})
export class UserModule {}
