import { User } from '@/user/entities/user.entity';
export type AuthUser = User & { permissions: string[] };