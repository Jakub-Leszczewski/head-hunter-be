import { User } from '../../user/entities/user.entity';

export interface InterviewInterface {
  id: string;
  hr: User;
  student: User;
  expiredAt: Date;
}
