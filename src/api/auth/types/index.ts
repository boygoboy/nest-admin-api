import { User } from '@/api/system/user/entities/user.entity';
export type AuthUser = User & { permissions: string[] };