import { hash } from 'bcrypt';

export async function hashPwd(password: string): Promise<string> {
  return hash(password, 13);
}
