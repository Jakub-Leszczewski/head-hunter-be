import { UserResponseAllData } from '../user';

export type GetAuthUserResponse = UserResponseAllData;
export type LoginResponse = UserResponseAllData;
export type LogoutResponse = { ok: boolean };
export type ResetPasswordResponse = { ok: boolean };
export type SetNewPasswordResponse = { ok: boolean };
