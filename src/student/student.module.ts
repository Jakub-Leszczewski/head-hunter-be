import { forwardRef, Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { UserModule } from '../user/user.module';
import { StudentHelperService } from './student-helper.service';
import { MailModule } from '../common/providers/mail/mail.module';

@Module({
  imports: [MailModule, forwardRef(() => UserModule)],
  controllers: [StudentController],
  providers: [StudentService, StudentHelperService],
  exports: [StudentService, StudentHelperService],
})
export class StudentModule {}
