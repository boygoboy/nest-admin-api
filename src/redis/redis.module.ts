import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [RedisService,{
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
            socket: {
                host: configService.get<string>('redis.host'),
                port: configService.get<number>('redis.port'),
            },
            database: configService.get<number>('redis.db'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports:[RedisService]
})
export class RedisModule {}
