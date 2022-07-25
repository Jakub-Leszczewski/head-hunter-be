import { ContractType } from './contract-type';
import { WorkType } from '../user/work-type';
import { UrlInterface, UrlResponseData } from './url';
import { UserInterface } from '../user';

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
  user: UserInterface;
}

export type StudentResponseData = Omit<
  StudentInterface,
  'bonusProjectUrls' | 'projectUrls' | 'portfolioUrls' | 'user'
> & {
  bonusProjectUrls: UrlResponseData[];
  projectUrls: UrlResponseData[];
  portfolioUrls: UrlResponseData[];
};
