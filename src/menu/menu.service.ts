import { Injectable,HttpException, HttpStatus,Inject  } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {  Repository } from 'typeorm';
import {Menu} from '@/menu/entities/menu.entity';
import { ConfigService } from '@nestjs/config';
import {RedisService} from '@/redis/redis.service'
import { BasicVo } from '@/baseclass/vo';
import {combineResposeData} from '@/utils'
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  async create(createMenuDto: CreateMenuDto) {
    console.log(createMenuDto);
    //添加一条菜单数据
    const menu=new Menu()
    menu.parentId=createMenuDto.parentId
    menu.name=createMenuDto.name
    menu.code=createMenuDto.code
    menu.component=createMenuDto.component
    menu.path=createMenuDto.path
    menu.redirect=createMenuDto.redirect
    menu.type=createMenuDto.type
    menu.sort=createMenuDto.sort
    menu.remark=createMenuDto.remark
    menu.isLink=createMenuDto.isLink
    menu.meta=createMenuDto.meta
    try{
    await this.menuRepository.save(menu)
      const bo=new BasicVo()
      return combineResposeData(bo,HttpStatus.OK,'创建成功','')
    }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findAll() {
    return `This action returns all menu`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  update(id: number, updateMenuDto: UpdateMenuDto) {
    return `This action updates a #${id} menu`;
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
