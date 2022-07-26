import {
  ArrayNotEmpty,
  IsEmail,
  IsNumber,
  IsUrl,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
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

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @ArrayNotEmpty()
  public bonusProjectUrls: string[];
}
