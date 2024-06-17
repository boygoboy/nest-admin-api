import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  In, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Role } from '@/role/entities/role.entity';
import { Menu } from '@/menu/entities/menu.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {PermissionDto} from './dto/permission.dto'
import { QueryDto } from './dto/query-dto';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  
  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;
 async create(createRoleDto: CreateRoleDto) {
  try{
    const role = new Role();
    role.roleCode=createRoleDto.roleCode
    role.roleName=createRoleDto.roleName
    role.remark=createRoleDto.remark
    role.status=createRoleDto.status
    await this.roleRepository.save(role)
    return '创建角色成功'
  }catch(error){
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
  }

  async update( updateRoleDto: UpdateRoleDto) {
     try{
      const role=new Role()
      role.id=updateRoleDto.id
      role.roleCode=updateRoleDto.roleCode
      role.roleName=updateRoleDto.roleName
      role.remark=updateRoleDto.remark
      role.status=updateRoleDto.status
      await this.roleRepository.save(role)
      return '更新角色成功'
     }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
     }
  }

  async distrubtePermission(id:number,permissionDto:PermissionDto){
       try{
        //根据菜单id查询出所有符合条件的菜单项
        const menus=await this.menuRepository.findBy({
          id:In(permissionDto.permissionIds)
        })
        if(menus.length!==permissionDto.permissionIds.length){
          throw new HttpException('有权限项不存在',HttpStatus.BAD_REQUEST)
        }
        //将查询出的menus赋值给role
        const role=new Role()
        role.id=id
        role.menus=menus
        await this.roleRepository.save(role)
        return '分配权限成功'
       }catch(error){
        if(error instanceof HttpException){
          throw error
        }
        throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
       }
  }

  async remove(id: number) {
    try{
      const role=await this.roleRepository.findOneBy({
        id
      })
      if(!role){
        throw new HttpException('角色不存在',HttpStatus.BAD_REQUEST)
      }
      await this.roleRepository.remove(role)
      return '删除角色成功'
    }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findMany(query:QueryDto) :Promise<Pagination<Role>>{
    try{
     const {current:page,size:limit,name}=query
      const options: IPaginationOptions = {
        page: page ,
        limit: limit,
      }

      const roles= await paginate<Role>(this.roleRepository, options, {
        roleName: name
      });
      return roles
    }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
