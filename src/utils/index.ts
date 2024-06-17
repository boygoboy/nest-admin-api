import * as crypto from 'crypto';
import {  HttpStatus } from '@nestjs/common';
export function md5(str:string) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}