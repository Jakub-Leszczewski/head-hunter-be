import { forwardRef, Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/providers/mail/mail.module';
import { HrHelperService } from './hr-helper.service';

@Module({
  imports: [MailModule, forwardRef(() => UserModule)],
  controllers: [HrController],
  providers: [HrService, HrHelperService],
  exports: [HrService, HrHelperService],
})
export class HrModule {}
