import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { StudentModule } from './student/student.module';
import { HrModule } from './hr/hr.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, MailModule, StudentModule, HrModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
