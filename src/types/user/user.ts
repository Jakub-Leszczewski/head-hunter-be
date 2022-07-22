import { UserRole } from './user-role';
import { StudentInterface } from './student';

export interface UserInterface {
  id: string;
  email: string;
  hashPwd: string | null;
  role: UserRole;
  isActive: boolean;
  userToken: string | null;
  student?: StudentInterface | null;
}

export type UserSaveData = Omit<UserInterface, 'hashPwd' | 'userToken'>;
