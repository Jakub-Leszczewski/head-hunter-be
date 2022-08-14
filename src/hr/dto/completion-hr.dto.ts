import { IsString, Length, Matches } from 'class-validator';
import { CompletionHrDtoInterface } from '../../types';
import { PASSWORD_REGEX } from '../../common/constants/constant';

export class CompletionHrDto implements CompletionHrDtoInterface {
  @IsString()
  @Length(8, 36)
  @Matches(PASSWORD_REGEX)
  public newPassword: string;
}
