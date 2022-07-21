import { UpdateStudentDtoInterface, WorkType } from '../../types';
import { ContractType } from '../../types/user/contract-type';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class SignupCompletionStudentDto implements UpdateStudentDtoInterface {
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

  @IsOptional()
  @IsString()
  @Length(0, 256)
  public bio: string;

  @IsOptional()
  @IsMobilePhone('pl-PL')
  public phoneNumber: string;

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @MinLength(1)
  public projectUrls: string[];

  @IsOptional()
  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @MinLength(0)
  public portfolioUrls: string[];

  @IsOptional()
  @IsString()
  public education: string;

  @IsOptional()
  @IsString()
  public courses: string;

  @IsOptional()
  @IsNumber()
  public monthsOfCommercialExp: number;

  @IsOptional()
  @IsString()
  public workExperience: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  public targetWorkCity: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(9999999.99)
  public expectedSalary: number;

  @IsOptional()
  @IsEnum(ContractType)
  public expectedContractType: ContractType;

  @IsOptional()
  @IsEnum(WorkType)
  public expectedTypeWork: WorkType;

  @IsOptional()
  @IsBoolean()
  public canTakeApprenticeship: boolean;
}