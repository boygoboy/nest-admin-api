import { Module } from '@nestjs/common';
import {APP_GUARD} from '@nestjs/core'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { MenuModule } from './menu/menu.module';
import { getConfig } from './config';
import { Menu } from './menu/entities/menu.entity';
import { Role } from './role/entities/role.entity';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import {LoginGuard} from '@/auth/login.guard'
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService) {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            expiresIn: configService.get('jwt.expireIn') || '30m'// 默认 30 分钟
          }
        }
      },
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true,
      load: [getConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('mysql.host'),
        port: configService.get<number>('mysql.port'),
        username: configService.get<string>('mysql.username'),
        password: configService.get<string>('mysql.password'),
        database: configService.get<string>('mysql.database'),
        synchronize: configService.get<boolean>('mysql.synchronize'),
        logging: configService.get<boolean>('mysql.logging'),
        entities: [User, Role, Menu],
        poolSize: configService.get<number>('mysql.poolSize'),
        connectorPackage: 'mysql2',
        extra: {
          authPlugin: 'sha256_password',
        },
      }),
    }),
    UserModule,
    RoleModule,
    MenuModule,
    RedisModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    }
  ],
})
export class AppModule {}
