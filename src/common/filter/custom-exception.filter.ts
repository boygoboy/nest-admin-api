import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject, BadRequestException } from '@nestjs/common';
import type { Response, Request } from "express";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const request = host.switchToHttp().getRequest<Request>();
    response.statusCode = exception.getStatus();
    const results = exception.getResponse() as any;
    const status = exception.getStatus();
    const code = results.statusCode;


    // 参数校验错误，默认都是BadRequestException
    const isArrayMessage = Array.isArray(results.message);
    const isValidationError =
      isArrayMessage && typeof results.message[0] === "string" && results.message[0].includes("⓿");
    const message: Array<{ field: string; message: Array<string> }> = [];
    if (exception instanceof BadRequestException && isValidationError) {
      results.message.forEach((item: string) => {
        const [key, val] = item.split("⓿") as [string, string];
        const findData = message.find((item) => item.field === key);
        if (findData) {
          findData.message.push(val);
        } else {
          message.push({ field: key, message: [val] });
        }
      });
    }

    // 记录日志
    const { method, originalUrl, body, query, params, ip } = request;
    this.logger.error("HttpException", {
      res: {
        code,
        status,
        message
      },
      req: {
        method,
        url: originalUrl,
        body,
        query,
        params,
        ip
      }
    });


    response.json({
      code: exception.getStatus(),
      message: 'fail',
      data: results?.message?.join ? results?.message?.join(',') : exception.message
    }).end();
  }
}

