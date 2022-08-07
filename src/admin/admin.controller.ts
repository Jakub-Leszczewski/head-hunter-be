import { Body, Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from '../common/guards/role.guard';
import { SetRole } from '../common/decorators/set-role';
import { FindAllNotificationQueryDto } from './dto/find-all-notification-query.dto';

@Controller('/api/admin')
export class AdminController {
  constructor(private readonly notificationService: AdminService) {}

  @Get('/notification')
  // @UseGuards(RoleGuard)
  @SetRole('admin')
  async findAllNotifications(@Query() query: FindAllNotificationQueryDto) {
    return this.notificationService.findAllNotifications(query);
  }
}
