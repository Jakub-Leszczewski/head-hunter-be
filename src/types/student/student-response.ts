import { UserResponseData } from '../user';
import { StudentResponseData } from './student';

export type StudentResponse = Omit<UserResponseData, 'student' | 'hr'> & {
  student: StudentResponseData;
};

export type GetStudentResponse = StudentResponse;
export type GetStudentsResponse = StudentResponse[];
export type CreateStudentsResponse = StudentResponse[];
export type CompleteStudentsResponse = StudentResponse;
export type UpdateStudentsResponse = StudentResponse;
