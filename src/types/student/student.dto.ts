import { WorkType } from '../user';
import { ContractType } from './contract-type';
import { SortBy } from './sort-by';
import { SortMethod } from '../sort-method';
import { StudentStatus } from './student-status';

export interface CreateStudentDtoInterface {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string[];
}

export interface UpdateStudentDtoInterface {
  lastName: string;
  firstName: string;
  email: string;
  githubUsername: string;
  bio: string;
  phoneNumber: string;
  projectUrls: string[];
  portfolioUrls: string[];
  education: string;
  courses: string;
  monthsOfCommercialExp: number;
  workExperience: string;
  expectedSalary: number;
  targetWorkCity: string;
  expectedContractType: ContractType;
  expectedTypeWork: WorkType;
  canTakeApprenticeship: boolean;
}

export interface FindAllQueryDtoInterface {
  page: number;
  sortBy: SortBy;
  sortMethod: SortMethod;
  search: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  contractType: ContractType[];
  typeWork: WorkType[];
  salaryMin: number;
  salaryMax: number;
  canTakeApprenticeship: boolean[];
  monthsOfCommercialExp: number;
}
