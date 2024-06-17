import { NestFactory } from '@nestjs/core';
import {  BadRequestException,
  HttpStatus,
  ValidationPipe} from '@nestjs/common';
import { AppModule } from './app.module';
import {getConfig} from './config';
import {FormatResponseInterceptor} from '@/interceptor/format-response.interceptor';
import {InvokeRecordInterceptor} from '@/interceptor/invoke-record.interceptor';
import {CustomExceptionFilter} from '@/filter/custom-exception.filter';
const config=getConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(config?.server?.prefix ?? '/');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 启用参数类型自动转换，常规设置
      whitelist: true, // 监听参数白名单，常规设置
      // 禁止非白名单参数，存在非白名单属性报错。此项可根据需求而定，如果设置false，将剥离非白名单属性
      forbidNonWhitelisted: true,
      // 设置校验失败后返回的http状态码
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
      // 设置校验失败后的响应数据格式
      exceptionFactory: (errors) => {
        // 此处要注意，errors是一个对象数组，包含了当前所调接口里，所有验证失败的参数及错误信息。
        // 此处的处理是只返回第一个错误信息
        const message = Object.values(errors[0].constraints);
        return new BadRequestException({
          message: message,
          status: HttpStatus.BAD_REQUEST,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(config?.server?.port??3000);
}
bootstrap();
