import { OnlyUserResponseData } from '../user';

export type LoginResponse = OnlyUserResponseData;
export type LogoutResponse = { ok: boolean };
export type ResetPasswordResponse = { ok: boolean };
export type SetNewPasswordResponse = { ok: boolean };