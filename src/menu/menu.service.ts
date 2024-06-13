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
  create(createMenuDto: CreateMenuDto) {
    console.log(createMenuDto);
    const bo=new BasicVo()
    return createMenuDto
    return combineResposeData(bo,HttpStatus.OK,'创建成功',createMenuDto)
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
