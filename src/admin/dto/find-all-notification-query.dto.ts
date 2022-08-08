import { NotificationDtoInterface } from '../../types';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindAllNotificationQueryDto implements NotificationDtoInterface {
  @IsString()
  @IsOptional()
  public search: string = '';

  @IsInt()
  @IsOptional()
  public page: number = 1;
}
