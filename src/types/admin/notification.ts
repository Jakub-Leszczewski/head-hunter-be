import { UserInterface } from '../user';

export interface NotificationInterface {
  id: string;
  message: string;
  createdAt: Date;
  user: UserInterface;
}
