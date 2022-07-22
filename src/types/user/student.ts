import { ContractType } from './contract-type';
import { WorkType } from './work-type';
import { UrlInterface, UrlResponse } from './url';

export interface StudentInterface {
  id: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  githubUsername: string | null;
  bio: string | null;
  phoneNumber: string | null;
  education: string | null;
  courses: string | null;
  monthsOfCommercialExp: number;
  workExperience: string | null;
  targetWorkCity: string | null;
  expectedSalary: number | null;
  expectedContractType: ContractType;
  expectedTypeWork: WorkType;
  canTakeApprenticeship: boolean;
  bonusProjectUrls: UrlInterface[];
  projectUrls: UrlInterface[];
  portfolioUrls: UrlInterface[];
}

export type StudentResponse = Omit<
  StudentInterface,
  'bonusProjectUrls' | 'projectUrls' | 'portfolioUrls'
> & {
  bonusProjectUrls: UrlResponse[];
  projectUrls: UrlResponse[];
  portfolioUrls: UrlResponse[];
};
