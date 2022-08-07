import { ChangeStatusDtoInterface, StudentStatus } from '../../types';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ChangeStatusDto implements ChangeStatusDtoInterface {
  @IsEnum(StudentStatus)
  public status: StudentStatus;

  @IsString()
  @IsOptional()
  public hrId: string;
}
