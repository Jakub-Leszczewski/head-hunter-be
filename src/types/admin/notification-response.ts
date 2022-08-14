import { NotificationResponse } from './notification';

export type GetNotificationResponse = NotificationResponse;
export type GetNotificationsResponse = {
  result: NotificationResponse[];
  totalEntitiesCount: number;
  totalPages: number;
};
