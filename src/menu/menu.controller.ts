import { Controller, Get, Post, Body, Put, Param, Delete, Query} from '@nestjs/common';
import {ParseIntPipe} from '@/pipe'
import { RequireLogin,UserInfo } from '@/custom.decorator';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller('/system/menu')
@RequireLogin()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Put()
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe) id: number|string) {
    return this.menuService.remove(id);
  }

  @Get('/search')
  findMany(@Query('keyword') keyword?: string) {
    return this.menuService.findMany(keyword);
  }

  @Get('/select')
  findAll(){
    return this.menuService.findAll();
  }

  @Get('/user')
  findUserMenu(@UserInfo('id') id: number) {
    return this.menuService.findUserMenu(id);
  }
}
