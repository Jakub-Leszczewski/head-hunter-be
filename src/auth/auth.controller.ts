import { Body, Controller, Delete, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ForgotPasswordResponse, LoginResponse, LogoutResponse } from '../types';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';

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
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<ForgotPasswordResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
