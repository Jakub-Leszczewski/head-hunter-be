import { IsEmail, IsInt, IsString, Length, Max, MaxLength, Min } from 'class-validator';
import { CreateHrDtoInterface } from '../../types';

export class CreateHrDto implements CreateHrDtoInterface {
  @IsEmail()
  @MaxLength(256)
  public email: string;

  @IsString()
  @Length(1, 60)
  public firstName: string;

  @IsString()
  @Length(1, 60)
  public lastName: string;

  @IsString()
  @Length(1, 256)
  public company: string;

  @IsInt()
  @Max(999)
  @Min(1)
  public maxReservedStudents: number;
}
