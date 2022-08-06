import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  UrlInterface,
  UrlResponseData,
  StudentResponse,
  UserRole,
  ContractType,
  WorkType,
  FindAllQueryFilter,
  SortBy,
  SortMethod,
  SmallStudentResponse,
  StudentStatus,
} from '../types';
import fetch from 'node-fetch';
import { User } from '../user/entities/user.entity';
import { UserHelperService } from '../user/user-helper.service';
import { Brackets, DataSource, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class StudentHelperService {
  constructor(
    @Inject(forwardRef(() => UserHelperService)) private userHelperService: UserHelperService,
    private dataSource: DataSource,
  ) {}

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

  filterStudent(userEntity: User): StudentResponse {
    const { hr, student, ...userResponse } = this.userHelperService.filter(userEntity);
    const {
      bonusProjectUrls,
      portfolioUrls,
      projectUrls,
      user,
      id,
      interviewWithHr,
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

  filterSmallStudent(userEntity: User): SmallStudentResponse {
    const { hr, student, ...userResponse } = this.userHelperService.filter(userEntity);
    const {
      id,
      bonusProjectUrls,
      portfolioUrls,
      projectUrls,
      user,
      bio,
      education,
      courses,
      workExperience,
      interviewWithHr,
      ...studentResponse
    } = student;

    return {
      ...userResponse,
      student: { ...studentResponse },
    };
  }

  findAllStudentsQb(
    ...cb: ((qb: SelectQueryBuilder<User>) => SelectQueryBuilder<User>)[]
  ): SelectQueryBuilder<User> {
    const query = this.dataSource
      .createQueryBuilder()
      .select([
        'user',
        'student.status',
        'student.courseCompletion',
        'student.courseEngagement',
        'student.projectDegree',
        'student.teamProjectDegree',
        'student.githubUsername',
        'student.phoneNumber',
        'student.monthsOfCommercialExp',
        'student.targetWorkCity',
        'student.expectedSalary',
        'student.expectedContractType',
        'student.expectedTypeWork',
        'student.canTakeApprenticeship',
      ])
      .from(User, 'user')
      .leftJoin('user.student', 'student')
      .leftJoin('student.interviewWithHr', 'interviewWithHr')
      .where('user.role=:role', { role: UserRole.Student });

    return cb.reduce((prev, curr) => curr(prev), query);
  }

  filterStudentQbCondition(query: FindAllQueryFilter) {
    const {
      courseCompletion,
      courseEngagement,
      projectDegree,
      teamProjectDegree,
      salaryMin,
      salaryMax,
      monthsOfCommercialExp,
      contractType,
      typeWork,
      canTakeApprenticeship,
    } = query;

    return (qb: SelectQueryBuilder<User>) =>
      qb
        .andWhere('student.courseCompletion >= :courseCompletion', { courseCompletion })
        .andWhere('student.courseEngagement >= :courseEngagement', { courseEngagement })
        .andWhere('student.projectDegree >= :projectDegree', { projectDegree })
        .andWhere('student.teamProjectDegree >= :teamProjectDegree', { teamProjectDegree })
        .andWhere('student.expectedSalary >= :salaryMin', { salaryMin })
        .andWhere('student.expectedSalary <= :salaryMax', { salaryMax })
        .andWhere('student.monthsOfCommercialExp >= :monthsOfCommercialExp', {
          monthsOfCommercialExp,
        })
        .andWhere('student.expectedContractType IN (:...contractType)', {
          contractType: [...contractType, ContractType.Irrelevant],
        })
        .andWhere('student.expectedTypeWork IN (:...typeWork)', {
          typeWork: [...typeWork, WorkType.Irrelevant],
        })
        .andWhere('student.canTakeApprenticeship IN (:...canTakeApprenticeship)', {
          canTakeApprenticeship,
        });
  }

  searchStudentQbCondition(search: string) {
    return (qb: SelectQueryBuilder<User>) =>
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('expectedTypeWork LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('targetWorkCity LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('expectedContractType LIKE :search', { search: `%${search.toLowerCase()}%` });
        }),
      );
  }

  orderByStudentQbCondition(sortBy: SortBy, sortMethod: SortMethod) {
    return (qb: SelectQueryBuilder<User>) =>
      qb.orderBy(sortBy ? `student.${sortBy}` : 'user.id', sortMethod);
  }

  paginationStudentQbCondition(page: number, maxOnPage: number) {
    return (qb: SelectQueryBuilder<User>) => qb.skip(maxOnPage * (page - 1)).take(maxOnPage);
  }

  statusStudentQbCondition(status: StudentStatus[]) {
    return (qb: SelectQueryBuilder<User>) =>
      qb.andWhere('student.status IN (:...status)', { status });
  }

  interviewWithHrStudentQbCondition(hrId: string) {
    return (qb: SelectQueryBuilder<User>) => qb.andWhere('interviewWithHr.id=:hrId', { hrId });
  }
}
