import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './api/system/user/user.module';
import { RoleModule } from './api/system/role/role.module';
import { MenuModule } from './api/system/menu/menu.module';
import { getConfig, IS_DEV } from './config';
import { Menu } from './api/system/menu/entities/menu.entity';
import { Role } from './api/system/role/entities/role.entity';
import { User } from './api/system/user/entities/user.entity';
import { RedisModule } from './common/redis/redis.module';
import { AuthModule } from './api/auth/auth.module';
import { LoginGuard } from '@/api/auth/login.guard'
import { PermissionGuard } from '@/api/auth/permission.guard'
import { WinstonModule } from "nest-winston";
import type { WinstonModuleOptions } from "nest-winston";
import { transports, format } from "winston";
import "winston-daily-rotate-file";
import { CustomExceptionFilter } from '@/common/filter/custom-exception.filter';
import { InvokeRecordInterceptor } from '@/common/interceptor/invoke-record.interceptor';
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
    WinstonModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 日志输出的管道
        const transportsList: WinstonModuleOptions["transports"] = [
          new transports.DailyRotateFile({
            level: "error",
            dirname: `logs`,
            filename: `%DATE%-error.log`,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "14d"
          }),
          new transports.DailyRotateFile({
            dirname: `logs`,
            filename: `%DATE%-combined.log`,
            datePattern: "YYYY-MM-DD",
            maxSize: "20m",
            maxFiles: "7d",
            format: format.combine(
              format((info) => {
                if (info.level === "error") {
                  return false; // 过滤掉'error'级别的日志
                }
                return info;
              })()
            )
          })
        ];
        // 开发环境下，输出到控制台
        if (IS_DEV) {
          transportsList.push(new transports.Console());
        }

        return {
          transports: transportsList
        };
      }
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
    },
    {
      provide: 'APP_GUARD',
      useClass: PermissionGuard
    },
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: InvokeRecordInterceptor
    }
  ],
})
export class AppModule { }
