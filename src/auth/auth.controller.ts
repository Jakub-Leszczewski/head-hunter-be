import { Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/user.decorator';
import { User } from '../user/entities/user.entity';
import { Response } from 'express';

@Controller('/api/auth')
export class AuthController {
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @HttpCode(200)
  login(@Res({ passthrough: true }) res: Response, @UserObj() user: User) {
    console.log(user);
    return true;
  }
}
