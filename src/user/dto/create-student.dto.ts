import { IsEmail, IsNumber, Length, Max, Min } from 'class-validator';
import { CreateStudentDtoInterface } from '../../types';

export class CreateStudentDto implements CreateStudentDtoInterface {
  @IsEmail()
  @Length(3, 255)
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
