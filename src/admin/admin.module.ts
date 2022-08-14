import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class AdminModule {}
