import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import {
  ResetPasswordResponse,
  LoginResponse,
  LogoutResponse,
  SetNewPasswordResponse,
} from '../types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SetNewPasswordDto } from './dto/set-new-password.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  login(@Res({ passthrough: true }) res: Response, @UserObj() user: User): Promise<LoginResponse> {
    return this.authService.login(user, res);
  }

  @Delete('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @Res({ passthrough: true }) res: Response,
    @UserObj() user: User,
  ): Promise<LogoutResponse> {
    return this.authService.logout(user, res);
  }

  @Delete('/password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Put('/password/:userToken')
  async setNewPassword(
    @Body() resetPasswordDto: SetNewPasswordDto,
    @Param('userToken') userToken: string,
  ): Promise<SetNewPasswordResponse> {
    return this.authService.setNewPassword(userToken, resetPasswordDto);
  }
}
