import { CanActivate, ExecutionContext, Injectable,Inject,UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import {RedisService} from '@/redis/redis.service';

declare module 'express' {
  interface Request {
    user: any
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(RedisService)
  private redisService: RedisService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request:Request = context.switchToHttp().getRequest();
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);
    if(!requireLogin){
      return true;
    }
    const authorization = request.headers.authorization;
    if(!authorization){
      throw new UnauthorizedException('未登录');
    }
    const token = authorization.split(' ')[1];
    const access_token_sessionid=token.slice(-10)
    const redisToken= this.redisService.getToken(`accessToken:${access_token_sessionid}`)
    if(!redisToken){
      throw new UnauthorizedException('未登录');
    }
    try{
      const data= this.jwtService.verify(token);
      request.user=data
      return true;
    }catch(error){
      throw new UnauthorizedException('未登录');
    }
  }
}
