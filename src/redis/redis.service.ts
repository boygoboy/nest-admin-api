import { Injectable,Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RedisService {
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType;
    @Inject(JwtService)
    private jwtService: JwtService;
   async setToken(key: string, token: string){
      const decoded=  this.jwtService.decode(token)
       if (!decoded || !decoded.exp) {
        console.log('无法解析Token或Token中无过期时间');
        return;
      }
      if(decoded.exp < Math.floor(Date.now() / 1000)){
        console.log('Token已过期');
        return;
      }
        const expire = decoded.exp - Math.floor(Date.now() / 1000);
       await this.redisClient.set(key, token, {EX:expire});
    }
    async delToken(key: string){
        await this.redisClient.del(key);
    }
    async getToken(key:string){
        return await this.redisClient.get(key);
    }
}
