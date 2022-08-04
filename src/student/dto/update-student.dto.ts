import { PartialType } from '@nestjs/mapped-types';
import { CompletionStudentDto } from './completion-student.dto';
import { ContractType, WorkType } from '../../types';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNotEmpty,
  IsNotIn,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsNotNull } from '../../common/decorators/validation';

export class UpdateStudentDto extends PartialType(CompletionStudentDto) {
  @IsString()
  @Length(1, 60)
  @IsNotNull()
  public lastName: string;

  @IsString()
  @Length(1, 60)
  @IsNotNull()
  public firstName: string;

  @IsEmail()
  @Length(3, 255)
  @IsNotNull()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @Length(8, 36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  public newPassword: string;

  @IsString()
  @Length(1, 39)
  @IsNotNull()
  public githubUsername: string;

  @IsString()
  @Length(0, 256)
  public bio: string;

  @IsMobilePhone()
  public phoneNumber: string;

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @ArrayNotEmpty()
  public projectUrls: string[];

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  public portfolioUrls: string[];

  @IsString()
  public education: string;

  @IsString()
  public courses: string;

  @IsInt()
  @Max(9999)
  @Min(0)
  @IsNotNull()
  public monthsOfCommercialExp: number;

  @IsString()
  public workExperience: string;

  @IsString()
  @Length(1, 50)
  public targetWorkCity: string;

  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  public expectedSalary: number;

  @IsEnum(ContractType)
  @IsNotNull()
  public expectedContractType: ContractType;

  @IsEnum(WorkType)
  @IsNotNull()
  public expectedTypeWork: WorkType;

  @IsBoolean()
  @IsNotNull()
  public canTakeApprenticeship: boolean;
}
