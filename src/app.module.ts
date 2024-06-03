import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { createClient } from 'redis';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import config from '../config/index';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load:[config]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get<string>('database.mysql.host'),
        port: configService.get<number>('database.mysql.port'),
        username: configService.get<string>('database.mysql.username'),
        password: configService.get<string>('database.mysql.password'),
        database: configService.get<string>('database.mysql.database'),
        synchronize: true,
        logging: true,
        entities: [],
        poolSize: 10,
        connectorPackage: 'mysql2',
        extra: {
            authPlugin: 'sha256_password',
        }
      })
    }),
    UserModule,
    RoleModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
            socket: {
                host: configService.get<string>('database.redis.host'),
                port: configService.get<number>('database.redis.port'),
            },
            database: configService.get<number>('database.redis.database'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    }
  ],
})
export class AppModule {}
