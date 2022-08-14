import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config/config';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../common/providers/mail/mail.module';

@Module({
  imports: [
    MailModule,
    PassportModule,
    UserModule,
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: { expiresIn: config.jwtTimeToExpire },
    }),
  ],
  controllers: [AuthController],
  providers: [LocalStrategy, AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
