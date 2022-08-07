import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RoleGuard } from '../common/guards/role.guard';
import { SetRole } from '../common/decorators/set-role';

@Controller('admin')
export class AdminController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('/notification')
  @UseGuards(RoleGuard)
  @SetRole('admin')
  findAllNotifications() {
    return this.notificationService.findAllNotifications();
  }
}
