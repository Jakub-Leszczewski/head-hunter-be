import { ConflictException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UrlInterface, UrlResponse, UserResponse } from '../types';
import fetch from 'node-fetch';

@Injectable()
export class UserHelperService {
  async checkGithubUsernameExist(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}`);

    return res.status === 200;
  }

  filterUrl(url: UrlInterface[]): UrlResponse[] {
    return (
      url?.map((e) => {
        const { student, ...urlResponse } = e;
        return urlResponse;
      }) ?? []
    );
  }

  //@TODO if will create hr table, this function must remove it
  filterStudent(user: User): UserResponse {
    const { hashPwd, userToken, student, ...userResponse } = user;
    const { bonusProjectUrls, portfolioUrls, projectUrls, ...studentResponse } = student;

    const newBonusProjectUrls = this.filterUrl(bonusProjectUrls);
    const newPortfolioUrls = this.filterUrl(portfolioUrls);
    const newProjectUrls = this.filterUrl(projectUrls);

    return {
      ...userResponse,
      student: {
        ...studentResponse,
        bonusProjectUrls: newBonusProjectUrls ? [...newBonusProjectUrls] : null,
        portfolioUrls: newPortfolioUrls ? [...newPortfolioUrls] : null,
        projectUrls: newProjectUrls ? [...newProjectUrls] : null,
      },
    };
  }

  async checkUserFieldUniqueness(value: { [key: string]: any }): Promise<boolean> {
    const user = await User.findOne({
      where: value,
    });

    return !user;
  }

  async checkUserFieldUniquenessAndThrow(value: { [key: string]: any }) {
    const fieldUniqueness = this.checkUserFieldUniqueness(value);

    if (!fieldUniqueness) throw new ConflictException();
  }
}
