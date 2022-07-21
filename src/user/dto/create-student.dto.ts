import { IsEmail, IsNumber, Max, MaxLength, Min } from 'class-validator';
import { CreateStudentDtoInterface } from '../../types';

export class CreateStudentDto implements CreateStudentDtoInterface {
  @IsEmail()
  @MaxLength(256)
  public email: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  public courseCompletion: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  public courseEngagement: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  public projectDegree: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  public teamProjectDegree: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  public bonusProjectUrls: number;
}
