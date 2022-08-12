import { ChangePasswordDtoInterface } from '../../types';
import { IsString, Length, Matches, MaxLength } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants/constant';

export class ChangePasswordDto implements ChangePasswordDtoInterface {
  @IsString()
  @MaxLength(36)
  public password: string;

  @IsString()
  @Length(8, 36)
  @Matches(PASSWORD_REGEX)
  public newPassword: string;
}
