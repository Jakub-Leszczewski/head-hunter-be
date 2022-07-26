import { StudentInterface } from './student';

export interface UrlInterface {
  id: string;
  url: string;
  student: StudentInterface;
}

export type UrlResponseData = Omit<UrlInterface, 'student'>;
