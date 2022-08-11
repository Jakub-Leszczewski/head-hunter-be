import { UserInterface } from '../user';

export interface InterviewInterface {
  id: string;
  hr: UserInterface;
  student: UserInterface;
  expiredAt: Date;
}
