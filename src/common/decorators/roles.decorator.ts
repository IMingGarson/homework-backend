import { SetMetadata } from '@nestjs/common';
import { Role } from '../../modules/auth/user.entity';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
