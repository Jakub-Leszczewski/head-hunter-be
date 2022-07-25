import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const hashCompareResult = await compare(password, user.hashPwd);

      if (hashCompareResult) {
        return user;
      }
    }

    return null;
  }
}
