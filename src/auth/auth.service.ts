import { Injectable,HttpException, HttpStatus,Inject ,UnauthorizedException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';
import { LoginDto } from './dto/login.dto';
import { BasicVo } from '@/baseclass/vo';
import {LoginVo} from './vo/login.vo';
import {md5,combineResposeData} from '@/utils'
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

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
      vo.access_token = this.jwtService.sign({...user}, {
        expiresIn: this.configService.get('jwt.expireIn') || '30m'
      });
      vo.refresh_token = this.jwtService.sign({...user}, {
        expiresIn: this.configService.get('jwt.refreshExpire') || '7d'
      });

     return combineResposeData(bo,HttpStatus.OK,'登录成功',vo)
    }

    async refreshtoken(refreshToken:string){
      try{
        const data = this.jwtService.verify(refreshToken);
        const user = await this.userRepository.findOne({
          where: {
              username:data.username,
          },
          relations: [ 'roles', 'roles.menus']
        })
        const bo=new BasicVo()
        const vo=new LoginVo();
        vo.access_token = this.jwtService.sign({...user}, {
          expiresIn: this.configService.get('jwt.expireIn') || '30m'
        });
        return combineResposeData(bo,HttpStatus.OK,'token刷新成功',vo)
      }catch(e){
        throw new UnauthorizedException('token 已失效，请重新登录');
      }
    }

    async logout(refreshToken:string,authorization:string){
      return {
        authorization
      }
    }
  }
