import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req } from '@nestjs/common';
import { ParseIntPipe } from '@/pipe'
import { RequireLogin, UserInfo } from '@/custom.decorator';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RequirePermission } from '@/custom.decorator'

@Controller('/system/menu')
@RequirePermission('system:menu:search')
@RequireLogin()
export class MenuController {
  constructor(private readonly menuService: MenuService) { }

  @Post()
  @RequirePermission('system:menu:add', 'system:child:add')
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Put()
  @RequirePermission('system:menu:edit')
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Delete(':id')
  @RequirePermission('system:menu:delete')
  remove(@Param('id', ParseIntPipe) id: number | string) {
    return this.menuService.remove(id);
  }

  @Get('/search')
  @RequirePermission('system:menu:search')
  findMany(@Query('keyword') keyword?: string) {
    return this.menuService.findMany(keyword);
  }

  @Get('/select')
  findAll() {
    return this.menuService.findAll();
  }

  @Get('/user')
  findUserMenu(@UserInfo('id') id: number) {
    return this.menuService.findUserMenu(id);
  }
}
