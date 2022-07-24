import { Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { HrHelperService } from './hr-helper.service';

@Module({
  imports: [UserModule, MailModule],
  controllers: [HrController],
  providers: [HrService, HrHelperService],
})
export class HrModule {}
