import { Inject, Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notification.entity';
import { FindAllNotificationQueryDto } from './dto/find-all-notification-query.dto';
import { DataSource } from 'typeorm';
import { config } from '../config/config';
import { NotificationResponse } from '../types';
import { GetNotificationsResponse } from '../types/admin/notification-response';

@Injectable()
export class AdminService {
  constructor(@Inject(DataSource) private dataSource: DataSource) {}

  async findAllNotifications(
    query: FindAllNotificationQueryDto,
  ): Promise<GetNotificationsResponse> {
    const { page, search } = query;
    const [result, totalEntitiesCount] = await this.dataSource
      .createQueryBuilder()
      .select(['notification'])
      .from(Notification, 'notification')
      .leftJoin('notification.user', 'user')
      .where('user.id LIKE :search', { search: `%${search}%` })
      .orWhere('user.firstName LIKE :search', { search: `%${search}%` })
      .orWhere('user.lastName LIKE :search', { search: `%${search}%` })
      .orWhere('CONCAT(user.firstName, " ", user.lastName) LIKE :search', { search: `%${search}%` })
      .skip(config.maxItemsOnPage * (page - 1))
      .take(config.maxItemsOnPage)
      .orderBy('notification.createdAt', 'DESC')
      .getManyAndCount();

    return {
      result: result.map((e) => this.filterNotification(e)),
      totalEntitiesCount,
      totalPages: Math.ceil(totalEntitiesCount / config.maxItemsOnPage),
    };
  }

  async createNotification(message: string, userId): Promise<void> {
    if (!userId) throw new Error('user id is empty');

    const user = await User.findOne({
      where: { id: userId },
    });
    if (!user) throw new Error(`not found user by id: ${userId}`);

    const notification = new Notification();
    notification.message = message;
    notification.createdAt = new Date();
    await notification.save();

    notification.user = user;
    await notification.save();
  }

  filterNotification(notification: Notification): NotificationResponse {
    const { user, ...notificationResponse } = notification;

    return notificationResponse;
  }
}
