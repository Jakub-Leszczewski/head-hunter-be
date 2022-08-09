import { IsString, Length, Matches } from 'class-validator';
import { CompletionHrDtoInterface } from '../../types';

export class CompletionHrDto implements CompletionHrDtoInterface {
  @IsString()
  @Length(8, 36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  public newPassword: string;
}
