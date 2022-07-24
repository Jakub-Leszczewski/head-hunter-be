import { IsString, Length, Matches } from 'class-validator';

export class CompletionHrDto {
  @IsString()
  @Length(8, 36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  public newPassword: string;
}
