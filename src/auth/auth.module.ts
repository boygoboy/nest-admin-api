import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([User,Role,Menu])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
