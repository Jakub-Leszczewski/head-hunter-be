import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StudentService } from './student.service';
import { HrService } from './hr.service';

@Module({
  controllers: [UserController],
  providers: [UserService, StudentService, HrService],
})
export class UserModule {}
