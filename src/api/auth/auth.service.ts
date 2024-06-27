import { Injectable, HttpException, HttpStatus, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken'; // 确保导入TokenExpiredError
import { User } from '@/api/system/user/entities/user.entity';
import { Role } from '@/api/system/role/entities/role.entity';
import { Menu } from '@/api/system/menu/entities/menu.entity';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';
import { md5 } from '@/utils'
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@/common/redis/redis.service'
import { AuthUser } from '@/api/auth/types/index'

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

  async haneleLogin(logindata: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        username: logindata.username,
      },
      relations: ['roles', 'roles.menus']
    });
    if (!user) {
      throw new HttpException('用户名或者密码错误', HttpStatus.BAD_REQUEST)
    }
    if (md5(logindata.password) !== user.password) {
      throw new HttpException('用户名或者密码错误', HttpStatus.BAD_REQUEST)
    }
    if (user.accountStatus === false) {
      throw new HttpException('账号已被禁用', HttpStatus.BAD_REQUEST)
    }

    const permissions = [...new Set(user.roles.map(role => role.menus).flat())].filter(menu => menu.type === 2).map(menu => menu.code) as string[]
    (user as AuthUser).permissions = permissions
    user.roles.forEach(role => {
      delete role.menus
    })
    const vo = new LoginVo();
    vo.access_token = this.jwtService.sign({ ...user }, {
      expiresIn: this.configService.get('jwt.expireIn') || '30m'
    });
    vo.refresh_token = this.jwtService.sign({ ...user }, {
      expiresIn: this.configService.get('jwt.refreshExpire') || '7d'
    });
    const access_token_sessionid = vo.access_token.slice(-10)
    const refresh_token_sessionid = vo.refresh_token.slice(-10)
    this.redisService.setToken(`refreshToken:${refresh_token_sessionid}`, vo.refresh_token)
    this.redisService.setToken(`accessToken:${access_token_sessionid}`, vo.access_token)
    return vo
  }

  async refreshtoken(refreshToken: string, authorization: string) {
    try {
      const token = authorization.split(' ')[1]
      const data = this.jwtService.verify(refreshToken);
      const user = await this.userRepository.findOne({
        where: {
          username: data.username,
        },
        relations: ['roles', 'roles.menus']
      })
      if (!user) {
        throw new UnauthorizedException('token 已失效，请重新登录');
      }
      try {
        // 尝试验证token，这里期望可能抛出TokenExpiredError
        const data = this.jwtService.verify(token);
        throw new HttpException('token已刷新请勿重复刷新', HttpStatus.BAD_REQUEST)
        // 如果没有错误抛出，表示token完全有效
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          // 如果捕获到TokenExpiredError，说明token有效但过期
          // 在这里处理过期的token
          const access_token_sessionid_history = token.slice(-10)
          this.redisService.delToken(`accessToken:${access_token_sessionid_history}`)
          const vo = new LoginVo();
          vo.access_token = this.jwtService.sign({ ...user }, {
            expiresIn: this.configService.get('jwt.expireIn') || '30m'
          });
          const access_token_sessionid = vo.access_token.slice(-10)
          this.redisService.setToken(`accessToken:${access_token_sessionid}`, vo.access_token)
          return vo
          // 还可以继续执行需要的业务逻辑
        } else {
          // 如果抛出的不是TokenExpiredError，那么token可能在其他方面无效
          if (error instanceof HttpException) {
            // 重新抛出HttpException，或者根据需要处理它
            throw error;
          } else {
            // 处理其他类型的错误
            throw new UnauthorizedException('token 已失效，请重新登录');
          }
        }
      }
    } catch (e) {
      if (e instanceof HttpException) {
        // 重新抛出HttpException，或者根据需要处理它
        throw e;
      } else {
        // 处理其他类型的错误
        throw new UnauthorizedException('token 已失效，请重新登录');
      }
    }
  }

  async logout(refreshToken: string, authorization: string) {
    if (!refreshToken) {
      throw new HttpException('refreshToken不能为空', HttpStatus.BAD_REQUEST)
    }
    try {
      this.jwtService.verify(refreshToken)
      const access_token = authorization.split(' ')[1]
      const access_token_sessionid = access_token.slice(-10)
      const refresh_token_sessionid = refreshToken.slice(-10)
      this.redisService.delToken(`accessToken:${access_token_sessionid}`)
      this.redisService.delToken(`refreshToken:${refresh_token_sessionid}`)
      return '退出成功'
    } catch (error) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
