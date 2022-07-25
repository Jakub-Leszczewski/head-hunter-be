import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config/config';
import { UserModule } from '../user/user.module';
import { StudentHelperService } from '../student/student-helper.service';
import { HrHelperService } from '../hr/hr-helper.service';
import { StudentModule } from '../student/student.module';
import { HrModule } from '../hr/hr.module';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: config.jwtTimeToExpire },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService],
  exports: [],
})
export class AuthModule {}
