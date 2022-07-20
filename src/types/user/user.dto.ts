import { WorkType } from './work-type';
import { ContractType } from './contract-type';

export interface CreateStudentDtoInterface {
  email: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: number;
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
