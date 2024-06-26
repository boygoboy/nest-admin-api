import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like } from 'typeorm';
import { PageResponseVo } from '@/api/system/role/vo/page-response.vo';
import { IResponseData, IResponsePagerData } from '@/utils/types';
import { formatResponsePagerData } from '@/utils/index';
import { StatusDto } from './dto/status.dto';
import {
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Role } from '@/api/system/role/entities/role.entity';
import { Menu } from '@/api/system/menu/entities/menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PermissionDto } from './dto/permission.dto'
import { QueryDto } from './dto/query-dto';

@Injectable()
export class RoleService {
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  async create(createRoleDto: CreateRoleDto) {
    try {
      const role = new Role();
      role.roleCode = createRoleDto.roleCode
      role.roleName = createRoleDto.roleName
      role.remark = createRoleDto.remark
      role.status = createRoleDto.status
      await this.roleRepository.save(role)
      return '创建角色成功'
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateRoleDto: UpdateRoleDto) {
    try {
      const role = await this.roleRepository.findOneBy({ id: updateRoleDto.id })
      role.roleCode = updateRoleDto.roleCode
      role.roleName = updateRoleDto.roleName
      role.remark = updateRoleDto.remark
      await this.roleRepository.save(role)
      return '更新角色成功'
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateStatus(roles: Role[], statusDto: StatusDto) {
    try {
      const { id, status } = statusDto
      const role = await this.roleRepository.findOneBy({ id })
      if (!role) {
        throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
      }
      const roleIds = roles.map(role => role.id)
      if (roleIds.includes(id) && status === false) {
        throw new HttpException('您已绑定该角色无法禁用', HttpStatus.BAD_REQUEST)
      }
      role.status = status
      await this.roleRepository.save(role)
      return '更新状态成功'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async distrubtePermission(id: number, permissionDto: PermissionDto) {
    try {
      //根据菜单id查询出所有符合条件的菜单项
      const menus = await this.menuRepository.findBy({
        id: In(permissionDto.permissionIds)
      })
      if (menus.length !== permissionDto.permissionIds.length) {
        throw new HttpException('有权限项不存在', HttpStatus.BAD_REQUEST)
      }
      //将查询出的menus赋值给role
      const role = await this.roleRepository.findOneBy({ id })
      role.menus = menus
      await this.roleRepository.save(role)
      return '分配权限成功'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number) {
    try {
      const role = await this.roleRepository.findOneBy({
        id
      })
      if (!role) {
        throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
      }
      if (role.roleCode == 'super_role') {
        throw new HttpException('超级管理员角色不能删除', HttpStatus.BAD_REQUEST)
      }
      await this.roleRepository.remove(role)
      return '删除角色成功'
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findMany(query: QueryDto): Promise<IResponseData<PageResponseVo>> {
    try {
      const { current: page, size: limit, name } = query
      const options: IPaginationOptions = {
        page: page,
        limit: limit,
      }
      const searchOptions = {
        where: [
          { roleName: Like(`%${name}%`) },
        ],
      };
      const roles: IResponsePagerData<PageResponseVo> = await paginate<Role>(this.roleRepository, options, searchOptions);
      return formatResponsePagerData<PageResponseVo>(roles)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const roles = await this.roleRepository.find()
      return roles
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findOnePermission(id: number): Promise<number[]> {
    try {
      const role = await this.roleRepository.findOne({
        where: { id },
        relations: ['menus'],
      });
      if (!role) {
        throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST)
      }
      return role.menus.map(menu => menu.id)
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
