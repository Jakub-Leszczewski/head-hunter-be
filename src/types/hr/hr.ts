import { UserInterface } from '../user';

export interface HrInterface {
  id: string;
  company: string;
  maxReservedStudents: number;
  user: UserInterface;
}

export type HrResponseData = Omit<HrInterface, 'user'>;
