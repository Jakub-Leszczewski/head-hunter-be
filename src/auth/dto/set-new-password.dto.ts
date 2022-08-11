import { SetNewPasswordDtoInterface } from '../../types/auth/auth.dto';
import { IsString, Length, Matches } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/constants/constant';

export class SetNewPasswordDto implements SetNewPasswordDtoInterface {
  @IsString()
  @Length(8, 36)
  @Matches(PASSWORD_REGEX)
  public newPassword: string;
}
