import * as crypto from 'crypto';
import {  HttpStatus } from '@nestjs/common';
import {IResponseData} from '@/utils/types';
export function md5(str:string) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

export function formatResponsePagerData<T>(data:any):IResponseData<T>{
    return {
        total:data.meta.totalItems,
        records:data.items
    }
}