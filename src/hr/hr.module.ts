import { forwardRef, Module } from '@nestjs/common';
import { HrService } from './hr.service';
import { HrController } from './hr.controller';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/providers/mail/mail.module';
import { HrHelperService } from './hr-helper.service';
import { StudentModule } from '../student/student.module';
import { InterviewService } from './interview.service';

@Module({
  imports: [MailModule, forwardRef(() => UserModule), forwardRef(() => StudentModule)],
  controllers: [HrController],
  providers: [HrService, HrHelperService, InterviewService],
  exports: [HrService, HrHelperService, InterviewService],
})
export class HrModule {}
