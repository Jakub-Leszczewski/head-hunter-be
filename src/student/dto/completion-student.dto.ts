import { UpdateStudentDtoInterface, WorkType, ContractType } from '../../types';
import {
  ArrayNotEmpty,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsMobilePhone,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants/constant';

export class CompletionStudentDto implements UpdateStudentDtoInterface {
  @IsString()
  @Length(1, 60)
  public lastName: string;

  @IsString()
  @Length(1, 60)
  public firstName: string;

  @IsOptional()
  @IsEmail()
  @Length(3, 255)
  public email: string;

  @IsOptional()
  @IsString()
  @MaxLength(36)
  public password: string;

  @IsString()
  @Length(8, 36)
  @Matches(PASSWORD_REGEX)
  public newPassword: string;

  @IsString()
  @Length(1, 39)
  public githubUsername: string;

  @IsOptional()
  @IsString()
  @Length(0, 256)
  public bio: string;

  @IsOptional()
  @IsMobilePhone()
  public phoneNumber: string;

  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  @ArrayNotEmpty()
  public projectUrls: string[];

  @IsOptional()
  @IsUrl({}, { each: true })
  @Length(1, 256, { each: true })
  public portfolioUrls: string[];

  @IsOptional()
  @IsString()
  public education: string;

  @IsOptional()
  @IsString()
  public courses: string;

  @IsOptional()
  @IsInt()
  @Max(9999)
  @Min(0)
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
