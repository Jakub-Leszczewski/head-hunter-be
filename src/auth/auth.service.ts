import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { compare } from 'bcrypt';
import { Response } from 'express';
import { config } from '../config/config';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserHelperService } from '../user/user-helper.service';
import { LoginResponse, LogoutResponse } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userHelperService: UserHelperService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({
      where: { email },
      relations: ['student', 'hr'],
    });

    if (user) {
      const hashCompareResult = await compare(password, user.hashPwd);

      if (hashCompareResult) {
        return user;
      }
    }

    return null;
  }

  async login(user: User, res: Response): Promise<LoginResponse> {
    user.jwtId = await this.generateNewJwtId();
    await user.save();

    const payload = { jwtId: user.jwtId };
    res.cookie('access_token', this.jwtService.sign(payload), {
      secure: false,
      httpOnly: true,
      maxAge: config.jwtCookieTimeToExpire,
    });

    return this.userHelperService.filterOnlyUser(user);
  }

  async logout(user: User, res: Response): Promise<LogoutResponse> {
    if (!user?.jwtId) return { ok: false };

    user.jwtId = null;
    await user.save();

    res.clearCookie('access_token', {
      secure: false,
      httpOnly: true,
      maxAge: config.jwtCookieTimeToExpire,
    });

    return { ok: true };
  }

  async generateNewJwtId(): Promise<string> {
    let isUniqueness: boolean;
    let newJwtId: string;
    do {
      newJwtId = uuid();
      isUniqueness = await this.userHelperService.checkUserFieldUniqueness({
        jwtId: newJwtId,
      });
    } while (!isUniqueness);

    return newJwtId;
  }
}
