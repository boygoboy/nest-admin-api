import { Injectable,HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';
import { LoginDto } from './dto/login.dto';
import { BasicVo } from '@/baseclass/vo';
import {LoginVo} from './vo/login.vo';
import {md5,combineResposeData} from '@/utils'

@Injectable()
export class AuthService {

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  async haneleLogin(logindata: LoginDto){
      const user = await this.userRepository.findOne({
        where: {
            username: logindata.username,
        },
        relations: [ 'roles', 'roles.menus']
    });
    if(!user){
      throw new HttpException('用户名或者密码错误',HttpStatus.BAD_REQUEST)
    }
    if(md5(logindata.password)!==user.password){
      throw new HttpException('用户名或者密码错误',HttpStatus.BAD_REQUEST)
    }
     const bo=new BasicVo()
      const vo=new LoginVo();
      vo.user={
        id: user.id,
        username: user.username,
        nickName: user.nickName,
        accountStatus: user.accountStatus,
        email: user.email,
        mobile: user.mobile,
        remark: user.remark,
        createTime: user.createTime,
        updateTime: user.updateTime,
        roleIds: user.roleIds,
        roles: user.roleIds 
      }
     return combineResposeData(bo,HttpStatus.BAD_REQUEST,'登录成功',vo)
    }
  }
