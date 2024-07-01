import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginGuard } from './login.guard';
import {PermissionGuard} from './permission.guard'
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../system/user/entities/user.entity';
import { Role } from '../system/role/entities/role.entity';
import { Menu } from '../system/menu/entities/menu.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu])
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginGuard,PermissionGuard],
})
export class AuthModule { }
