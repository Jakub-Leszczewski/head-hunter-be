import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [DatabaseModule, UserModule, MailModule, StudentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
