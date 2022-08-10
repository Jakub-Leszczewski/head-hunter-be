import { UserResponseData, UserRole } from '../user';
import { StudentSmallResponseData, StudentResponseData } from './student';

export type StudentResponse = Omit<UserResponseData, 'student' | 'hr' | 'role'> & {
  student: StudentResponseData;
  role: UserRole.Student;
};

export type SmallStudentResponse = Omit<UserResponseData, 'student' | 'hr' | 'role'> & {
  student: StudentSmallResponseData;
  role: UserRole.Student;
};

export type GetStudentResponse = StudentResponse;
export type GetStudentsResponse = {
  result: SmallStudentResponse[];
  totalEntitiesCount: number;
  totalPages: number;
};
export type CreateStudentsResponse = StudentResponse[];
export type CompleteStudentResponse = StudentResponse;
export type UpdateStudentResponse = StudentResponse;
export type ChangeStudentStatusResponse = StudentResponse;
