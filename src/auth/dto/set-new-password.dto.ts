import { SetNewPasswordDtoInterface } from '../../types/auth/auth.dto';
import { IsString, Length, Matches } from 'class-validator';

export class SetNewPasswordDto implements SetNewPasswordDtoInterface {
  @IsString()
  @Length(8, 36)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/)
  public newPassword: string;
}
