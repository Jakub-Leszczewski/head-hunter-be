import { UserResponseData } from '../user';
import { SmallStudentData, StudentResponseData } from './student';

export type StudentResponse = Omit<UserResponseData, 'student' | 'hr'> & {
  student: StudentResponseData;
};

export type SmallStudentResponse = Omit<UserResponseData, 'student' | 'hr'> & {
  student: SmallStudentData;
};

export type GetStudentResponse = StudentResponse;
export type GetStudentsResponse = {
  result: SmallStudentResponse[];
  totalEntitiesCount: number;
  totalPages: number;
};
export type CreateStudentsResponse = StudentResponse[];
export type CompleteStudentsResponse = StudentResponse;
export type UpdateStudentsResponse = StudentResponse;
