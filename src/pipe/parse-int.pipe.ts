import { ArgumentMetadata, Injectable, PipeTransform,BadRequestException  } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string|number,number> {
  transform(value: number|string, metadata: ArgumentMetadata):number {
        // 检查并处理额外的引号
        if ((typeof value === 'string' && value.startsWith('"') && value.endsWith('"'))||(typeof value === 'string' && value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);  // 去除字符串首尾的引号
        }
       // 尝试将输入转换为数字
       const val = parseInt(value as string, 10);
        // 如果转换失败，则抛出异常
        if (isNaN(val)) {
          throw new BadRequestException('参数格式错误')
        }
        return val
  }
}
