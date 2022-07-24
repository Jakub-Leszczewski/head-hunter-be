import { Injectable } from '@nestjs/common';
import { UrlInterface, UrlResponseData, StudentResponse } from '../types';
import fetch from 'node-fetch';
import { User } from '../user/entities/user.entity';

@Injectable()
export class StudentHelperService {
  async checkGithubExist(username: string) {
    const res = await fetch(`https://api.github.com/users/${username}`);

    return res.status === 200;
  }

  filterUrl(url: UrlInterface[]): UrlResponseData[] {
    return (
      url?.map((e) => {
        const { student, ...urlResponse } = e;
        return urlResponse;
      }) ?? []
    );
  }

  filterStudent(user: User): StudentResponse {
    const { hashPwd, userToken, hr, student, ...userResponse } = user;
    const {
      bonusProjectUrls,
      portfolioUrls,
      projectUrls,
      user: userData,
      ...studentResponse
    } = student;

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
}
