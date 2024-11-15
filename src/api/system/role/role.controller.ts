import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionDto } from './dto/permission.dto'
import { QueryDto } from './dto/query-dto';
import { StatusDto } from './dto/status.dto';
import { Role } from './entities/role.entity';
import {RequireLogin, RequirePermission, UserInfo,RequireSendWs } from '@/common/decorators/custom.decorator';

@Controller('/system/role')
@RequirePermission('system:role:search')
@RequireLogin()
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  @RequirePermission('system:role:add')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Put()
  @RequireSendWs('role-update')
  @RequirePermission('system:role:edit')
  update(@Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(updateRoleDto);
  }

  @Put('/status')
  @RequirePermission('system:role:edit')
  updateStatus(@UserInfo('roles') roles: Role[], @Body() statusDto: StatusDto) {
    return this.roleService.updateStatus(roles, statusDto);
  }

  @Put('/:id/menu/ids')
  @RequirePermission('system:role:menu')
  distrubtePermission(@Param('id', ParseIntPipe) id: number, @Body() permissionDto: PermissionDto) {
    return this.roleService.distrubtePermission(id, permissionDto)
  }

  @Delete(':id')
  @RequirePermission('system:role:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.remove(id);
  }

  @Get('/search')
  findMany(@Query() query: QueryDto) {
    return this.roleService.findMany(query);
  }

  @Get('/:id/menu/ids')
  findOnePermission(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.findOnePermission(id)
  }

  @Get('/list')
  @RequirePermission('require:login')
  findAll() {
    return this.roleService.findAll()
  }
}
