import { Injectable,Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType;
}
