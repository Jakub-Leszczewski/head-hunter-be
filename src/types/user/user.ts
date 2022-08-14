import { UserRole } from './user-role';
import { StudentInterface, StudentResponse } from '../student';
import { HrInterface, HrResponse } from '../hr';

export interface UserInterface {
  id: string;
  lastName: string | null;
  firstName: string | null;
  email: string;
  hashPwd: string | null;
  role: UserRole;
  isActive: boolean;
  userToken: string | null;
  userTokenExpiredAt: Date | null;
  jwtId: string | null;
  student?: StudentInterface | null;
  hr?: HrInterface | null;
}

export type UserResponseData = Omit<
  UserInterface,
  'hashPwd' | 'userToken' | 'jwtId' | 'userTokenExpiredAt'
>;

export type OnlyUserResponse = Omit<UserResponseData, 'student' | 'hr'>;

export type AdminResponse = Omit<OnlyUserResponse, 'role'> & {
  role: UserRole.Admin;
};

export type UserResponseAllData = AdminResponse | StudentResponse | HrResponse;
