import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { UserHelperService } from './user-helper.service';

@Module({
  imports: [MailModule],
  controllers: [UserController],
  providers: [UserService, UserHelperService],
  exports: [UserService, UserHelperService],
})
export class UserModule {}
