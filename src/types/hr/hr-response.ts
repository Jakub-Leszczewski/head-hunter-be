import { UserResponseData, UserRole } from '../user';
import { HrResponseData } from './hr';

export type HrResponse = Omit<UserResponseData, 'student' | 'hr' | 'role'> & {
  hr: HrResponseData;
  role: UserRole.Hr;
};

export type CreateHrResponse = HrResponse;
export type CompletionSignupHrResponse = HrResponse;
