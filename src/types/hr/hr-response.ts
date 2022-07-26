import { UserResponseData } from '../user';
import { HrResponseData } from './hr';

export type HrResponse = Omit<UserResponseData, 'student' | 'hr'> & {
  hr: HrResponseData;
};

export type CreateHrResponse = HrResponse;
export type CompletionSignupHrResponse = HrResponse;
