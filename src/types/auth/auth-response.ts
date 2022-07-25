import { OnlyUserResponseData } from '../user';

export type LoginResponse = OnlyUserResponseData;
export type LogoutResponse = { ok: boolean };
export type ForgotPasswordResponse = { ok: boolean };
