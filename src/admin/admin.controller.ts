import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: NotificationService) {}
  @Get()
  findAllNotifications() {
    return this.adminService.findAllNotifications();
  }
}
