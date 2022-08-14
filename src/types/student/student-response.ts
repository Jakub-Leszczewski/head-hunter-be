import { UserResponseData, UserRole } from '../user';
import { StudentSmallResponseData, StudentResponseData } from './student';
import { InterviewInterface } from '../hr/interview';

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

export type CreateInterviewResponse = Omit<InterviewInterface, 'hr' | 'student'> & {
  hrId: string;
  studentId: string;
};
export type RemoveInterviewResponse = Omit<InterviewInterface, 'id' | 'hr' | 'student'> & {
  hrId: string;
  studentId: string;
};

export type ChangeStudentEmployedStatusResponse = StudentResponse;
