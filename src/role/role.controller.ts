import { Controller, Get, Post, Body, Patch, Param, Delete,Put ,ParseIntPipe, Query} from '@nestjs/common';
import { RequireLogin } from '@/custom.decorator';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {PermissionDto} from './dto/permission.dto'
import { QueryDto } from './dto/query-dto';

@Controller('/system/role')
@RequireLogin()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Put()
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @Post('/:id/menu/ids')
  distrubtePermission(@Param('id',ParseIntPipe) id:number, @Body() permissionDto:PermissionDto){
   return this.roleService.distrubtePermission(id,permissionDto)
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Get('/search')
  findMany(@Query() query:QueryDto) {
    return this.roleService.findMany(query);
  }

  @Get('/:id/menu/ids')
  findOnePermission(@Param('id',ParseIntPipe) id:number){
    return this.roleService.findOnePermission(id)
  }
}
