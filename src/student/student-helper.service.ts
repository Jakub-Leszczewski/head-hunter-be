import { ConflictException, forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ContractType,
  FindAllQueryFilter,
  SmallStudentResponse,
  SortBy,
  SortMethod,
  StudentResponse,
  StudentStatus,
  UrlInterface,
  UrlResponseData,
  UserRole,
  WorkType,
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
    const { bonusProjectUrls, portfolioUrls, projectUrls, user, id, ...studentResponse } = student;

    const newBonusProjectUrls = this.filterUrl(bonusProjectUrls);
    const newPortfolioUrls = this.filterUrl(portfolioUrls);
    const newProjectUrls = this.filterUrl(projectUrls);

    return {
      ...userResponse,
      role: UserRole.Student,
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
      ...studentResponse
    } = student;

    return {
      ...userResponse,
      role: UserRole.Student,
      student: { ...studentResponse },
    };
  }

  async checkStudentFieldUniqueness(value: { [key: string]: any }): Promise<boolean> {
    const user = await User.findOne({
      where: { student: value },
    });

    return !user;
  }

  async checkStudentFieldUniquenessAndThrow(value: { [key: string]: any }) {
    const fieldUniqueness = await this.checkStudentFieldUniqueness(value);

    if (!fieldUniqueness) throw new ConflictException();
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
      .leftJoin('user.studentAtInterview', 'studentAtInterview')
      .leftJoin('studentAtInterview.hr', 'studentInterview')
      .leftJoin('user.student', 'student')
      .where('user.role=:role', { role: UserRole.Student })
      .andWhere('user.isActive=:isActive', { isActive: true });

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
          qb.where('student.expectedTypeWork LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('student.targetWorkCity LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('student.expectedContractType LIKE :search', {
              search: `%${search.toLowerCase()}%`,
            });
        }),
      );
  }

  searchStudentByNameQbCondition(search: string) {
    return (qb: SelectQueryBuilder<User>) =>
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('user.lastName LIKE :search', { search: `%${search.toLowerCase()}%` })
            .orWhere('CONCAT(user.firstName, " ", user.lastName) LIKE :search', {
              search: `%${search.toLowerCase()}%`,
            });
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
    return (qb: SelectQueryBuilder<User>) => qb.andWhere('studentInterview.id=:hrId', { hrId });
  }
}
