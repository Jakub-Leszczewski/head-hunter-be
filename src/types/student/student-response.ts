import { UserResponseData } from '../user';
import { StudentResponseData } from './student';

export type StudentResponse = Omit<UserResponseData, 'student'> & {
  student: StudentResponseData;
};

export type CreateStudentsResponse = StudentResponse[];
export type SignupCompleteStudentsResponse = StudentResponse;
