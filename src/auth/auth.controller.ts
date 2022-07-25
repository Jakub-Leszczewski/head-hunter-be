import { Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginResponse } from '../types';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  login(@Res({ passthrough: true }) res: Response, @UserObj() user: User): Promise<LoginResponse> {
    return this.authService.login(user, res);
  }
}
