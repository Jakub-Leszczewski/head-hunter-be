import { ResetPasswordDtoInterface } from '../../types/auth/auth.dto';
import { IsString } from 'class-validator';

export class ResetPasswordDto implements ResetPasswordDtoInterface {
  @IsString()
  public email: string;
}
