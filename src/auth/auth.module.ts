import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {LoginGuard} from './login.guard';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Role,Menu])
  ],
  controllers: [AuthController],
  providers: [AuthService,LoginGuard],
})
export class AuthModule {}
