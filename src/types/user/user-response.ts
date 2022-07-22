import { CreateStudentDtoInterface } from './user.dto';
import { UserSaveData } from './user';
import { StudentResponse } from './student';
import { UrlResponse } from './url';

// export type CreateStudentsResponse = CreateStudentDtoInterface[];
export type CreateStudentResponse = Omit<UserSaveData, 'student'> & {
  student: StudentResponse;
};
export type CreateStudentsResponse = CreateStudentResponse[];
