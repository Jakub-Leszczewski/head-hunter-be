import { IsEmail, IsInt, IsString, Length, Max, MaxLength, Min } from 'class-validator';

export class CreateHrDto {
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
  @Min(0)
  public maxReservedStudents: number;
}
