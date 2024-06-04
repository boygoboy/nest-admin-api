import * as crypto from 'crypto';
import {  HttpStatus } from '@nestjs/common';
import { BasicVo } from '@/baseclass/vo';
export function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

export function combineResposeData(bo:BasicVo,code:HttpStatus,message:string,data:any){
   bo.code=code
   bo.message=message
   bo.data=data
   return bo
}