import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { User } from '@/api/system/user/entities/user.entity';
import { Role } from '@/api/system/role/entities/role.entity';
import { Menu } from '@/api/system/menu/entities/menu.entity';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(Reflector)
  private reflector: Reflector;
  
  @InjectEntityManager()
  private entityManager: EntityManager;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }

    const user = await this.entityManager.findOne(User, {
        where: {
          id: request.user.id,
        },
        relations: ['roles', 'roles.menus']
      });
    
    if (!user) {
        throw new UnauthorizedException('用户不存在');
    }

    if(request.user.password !== user.password) {
        throw new UnauthorizedException('密码已失效，请重新登录');
    }

    const permissions = [...new Set(user.roles.map(role => role.menus).flat())].filter(menu => menu.type === 2).map(menu => menu.code) as string[]

    if (!permissions) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPermissions) {
      return true;
    }

    if (requiredPermissions.find(item => item === 'require:login' || item === 'white:list')) {
      return true;
    }

    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item: string) => item === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}

