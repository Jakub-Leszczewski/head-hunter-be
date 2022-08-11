import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Brackets, DataSource, LessThan } from 'typeorm';
import { User } from '../../../user/entities/user.entity';
import { Interview } from '../../../hr/entities/interview.entity';

@Injectable()
export class CronService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}
  @Cron(CronExpression.EVERY_HOUR)
  async unlockStudentsFromInterview() {
    const { affected } = await Interview.delete({
      expiredAt: LessThan(new Date()),
    });

    console.log(`move students from an expired interview to the available list: ${affected}`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeNotActiveUsers() {
    const { affected } = await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(User, 'user')
      .where(
        new Brackets((qb) =>
          qb
            .where('user.userTokenExpiredAt<:currentDate', { currentDate: new Date() })
            .orWhere('user.userTokenExpiredAt IS NULL'),
        ),
      )
      .andWhere('isActive=:isActive', { isActive: false })
      .execute();

    console.log(`remove not active users ${affected}`);
  }
}
