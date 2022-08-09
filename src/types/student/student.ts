import { ContractType } from './contract-type';
import { UrlInterface, UrlResponseData } from './url';
import { UserInterface } from '../user';
import { StudentStatus } from './student-status';
import { WorkType } from './work-type';

export interface StudentInterface {
  id: string;
  status: StudentStatus;
  interviewWithHr: UserInterface;
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
  expectedSalary: number;
  expectedContractType: ContractType;
  expectedTypeWork: WorkType;
  canTakeApprenticeship: boolean;
  interviewExpiredAt: Date | null;
  bonusProjectUrls: UrlInterface[];
  projectUrls: UrlInterface[];
  portfolioUrls: UrlInterface[];
  user: UserInterface;
}

export type StudentSmallResponseData = Omit<
  StudentInterface,
  | 'id'
  | 'bonusProjectUrls'
  | 'projectUrls'
  | 'portfolioUrls'
  | 'user'
  | 'bio'
  | 'education'
  | 'courses'
  | 'workExperience'
  | 'interviewWithHr'
  | 'interviewExpiredAt'
>;

export type StudentResponseData = Omit<
  StudentInterface,
  | 'id'
  | 'bonusProjectUrls'
  | 'projectUrls'
  | 'portfolioUrls'
  | 'user'
  | 'interviewWithHr'
  | 'interviewExpiredAt'
> & {
  bonusProjectUrls: UrlResponseData[];
  projectUrls: UrlResponseData[];
  portfolioUrls: UrlResponseData[];
};
