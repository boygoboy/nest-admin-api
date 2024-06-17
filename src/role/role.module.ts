import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from '@/role/entities/role.entity';
import { Menu } from '@/menu/entities/menu.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Role,Menu])
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
