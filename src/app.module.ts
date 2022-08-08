import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/providers/database/database.module';
import { UserModule } from './user/user.module';
import { MailModule } from './common/providers/mail/mail.module';
import { StudentModule } from './student/student.module';
import { HrModule } from './hr/hr.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { CronModule } from './common/providers/cron/cron.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    MailModule,
    StudentModule,
    HrModule,
    AuthModule,
    AdminModule,
    CronModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
