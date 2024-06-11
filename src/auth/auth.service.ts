import { Injectable,HttpException, HttpStatus,Inject ,UnauthorizedException,Headers} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';
import { LoginDto } from './dto/login.dto';
import { BasicVo } from '@/baseclass/vo';
import {LoginVo} from './vo/login.vo';
import {md5,combineResposeData} from '@/utils'
import { ConfigService } from '@nestjs/config';
import {RedisService} from '@/redis/redis.service'

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

  @Inject(RedisService)
  private redisService: RedisService;

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
      const access_token_sessionid=vo.access_token.slice(-10)
      const refresh_token_sessionid=vo.refresh_token.slice(-10)
      this.redisService.setToken(`refreshToken:${refresh_token_sessionid}`,vo.refresh_token)
      this.redisService.setToken(`accessToken:${access_token_sessionid}`,vo.access_token)
     return combineResposeData(bo,HttpStatus.OK,'登录成功',vo)
    }

    async refreshtoken(refreshToken:string, authorization:string){
      try{
        const token=authorization.split(' ')[1]
        const data = this.jwtService.verify(refreshToken);
        const user = await this.userRepository.findOne({
          where: {
              username:data.username,
          },
          relations: [ 'roles', 'roles.menus']
        })
        if(!user){
          throw new UnauthorizedException('token 已失效，请重新登录');
        }
        const access_token_sessionid_history=token.slice(-10)
        this.redisService.delToken(`accessToken:${access_token_sessionid_history}`)
        const bo=new BasicVo()
        const vo=new LoginVo();
        vo.access_token = this.jwtService.sign({...user}, {
          expiresIn: this.configService.get('jwt.expireIn') || '30m'
        });
        const access_token_sessionid=vo.access_token.slice(-10)
        this.redisService.setToken(`accessToken:${access_token_sessionid}`,vo.access_token)
        return combineResposeData(bo,HttpStatus.OK,'token刷新成功',vo)
      }catch(e){
        throw new UnauthorizedException('token 已失效，请重新登录');
      }
    }

    async logout(refreshToken:string,authorization:string){
      if(!refreshToken){
        throw new HttpException('refreshToken不能为空',HttpStatus.BAD_REQUEST)
      }
      const access_token=authorization.split(' ')[1]
      const access_token_sessionid=access_token.slice(-10)
      const refresh_token_sessionid=refreshToken.slice(-10)
      this.redisService.delToken(`accessToken:${access_token_sessionid}`)
      this.redisService.delToken(`refreshToken:${refresh_token_sessionid}`)
      const bo=new BasicVo()
      return combineResposeData(bo,HttpStatus.OK,'退出登录成功','')
    }
  }
