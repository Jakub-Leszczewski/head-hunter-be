import { ChangeStatusInterviewDtoInterface } from '../../types';
import { IsString } from 'class-validator';

export class ChangeStatusInterviewDto implements ChangeStatusInterviewDtoInterface {
  @IsString()
  public hrId: string;
}
