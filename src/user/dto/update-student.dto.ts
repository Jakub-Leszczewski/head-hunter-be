import { PartialType } from '@nestjs/mapped-types';
import { SignupCompletionStudentDto } from './signup-completion-student.dto';
import { ContractType } from '../../types/user/contract-type';
import { WorkType } from '../../types';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateStudentDto extends PartialType(SignupCompletionStudentDto) {
  @IsString()
  @Length(1, 60)
  public lastName: string;

  @IsString()
  @Length(1, 60)
  public firstName: string;

  @IsEmail()
  @Length(3, 255)
  public email: string;

  @IsString()
  @Length(1, 39)
  public githubUsername: string;

  @IsString()
  @Length(0, 256)
  public bio: string;

  @IsMobilePhone('pl-PL')
  public phoneNumber: string;

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @MinLength(1)
  public projectUrls: string[];

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @MinLength(0)
  public portfolioUrls: string[];

  @IsString()
  public education: string;

  @IsString()
  public courses: string;

  @IsNumber()
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
  public expectedContractType: ContractType;

  @IsEnum(WorkType)
  public expectedTypeWork: WorkType;

  @IsBoolean()
  public canTakeApprenticeship: boolean;
}
