import { UserResponseData } from '../user';
import { HrResponseData } from './hr';

export type HrResponse = Omit<UserResponseData, 'student' | 'hr'> & {
  hr: HrResponseData;
};
