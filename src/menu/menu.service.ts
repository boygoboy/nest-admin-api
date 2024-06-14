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

  async update(updateMenuDto: UpdateMenuDto) {
     try{
      const {id}=updateMenuDto
      const menu=await this.menuRepository.findOneBy({id})
      if(!menu){
        throw new HttpException('菜单不存在',HttpStatus.BAD_REQUEST)
      }
      menu.parentId=updateMenuDto.parentId
      menu.name=updateMenuDto.name
      menu.code=updateMenuDto.code
      menu.component=updateMenuDto.component
      menu.path=updateMenuDto.path
      menu.redirect=updateMenuDto.redirect
      menu.type=updateMenuDto.type
      menu.sort=updateMenuDto.sort
      menu.remark=updateMenuDto.remark
      menu.isLink=updateMenuDto.isLink
      menu.meta=updateMenuDto.meta
      await this.menuRepository.save(menu)
      const bo=new BasicVo()
      return combineResposeData(bo,HttpStatus.OK,'更新成功','')
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

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
