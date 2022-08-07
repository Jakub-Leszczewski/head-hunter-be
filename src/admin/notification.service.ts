import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  findAllNotifications() {
    const notifications = Notification.findAndCount();
    return `This action returns all admin`;
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
}
