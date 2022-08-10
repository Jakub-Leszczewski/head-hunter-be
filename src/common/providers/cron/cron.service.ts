import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Student } from '../../../student/entities/student.entity';
import { StudentStatus } from '../../../types';
import { Raw } from 'typeorm';
import { User } from '../../../user/entities/user.entity';

@Injectable()
export class CronService {
  // @Cron(CronExpression.EVERY_HOUR)
  async unlockStudentsFromInterview() {
    const currentData = new Date();
    const sqlDateTime =
      currentData.toISOString().split('T')[0] + ' ' + currentData.toTimeString().split(' ')[0];

    //@TODO nowy sposób
    // const result = await Student.update(
    //   {
    //     status: StudentStatus.AtInterview,
    //     interviewExpiredAt: Raw((field) => `${field} < '${sqlDateTime}' OR ${field} IS NULL`),
    //   },
    //   {
    //     status: StudentStatus.Available,
    //     interviewExpiredAt: null,
    //     interviewWithHr: null,
    //   },
    // );

    // console.log(`move students from an expired interview to the available list ${result.affected}`);
  }

  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async removeNotActiveUsers() {
    const currentData = new Date();
    const sqlDateTime =
      currentData.toISOString().split('T')[0] + ' ' + currentData.toTimeString().split(' ')[0];

    const result = await User.delete({
      isActive: false,
      userTokenExpiredAt: Raw((field) => `${field} < '${sqlDateTime}' OR ${field} IS NULL`),
    });

    console.log(`remove not active users ${result.affected}`);
  }
}
