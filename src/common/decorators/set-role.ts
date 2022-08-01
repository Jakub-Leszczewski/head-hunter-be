import { SetMetadata } from '@nestjs/common';

export const SetRole = (...roles: string[]) => SetMetadata('auth_role', roles);
