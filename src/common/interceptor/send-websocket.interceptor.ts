import { CallHandler, ExecutionContext, Injectable, NestInterceptor,Inject } from '@nestjs/common';
import { Observable,tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';

@Injectable()
export class SendWebsocketInterceptor implements NestInterceptor {
    @Inject(Reflector)
    private reflector: Reflector;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requiredTriggers = this.reflector.getAllAndOverride<string[]>('require-send-ws', [
        context.getHandler(),
        context.getClass(),
      ])
      return next.handle().pipe(
        tap((res) => {
         if(!requiredTriggers){
            return;
         }
         
        }),
      );
  }
}
