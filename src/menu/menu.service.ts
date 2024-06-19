import { Injectable,HttpException, HttpStatus,Inject  } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {  Repository,TreeRepository, Like } from 'typeorm';
import {Menu} from '@/menu/entities/menu.entity';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import {RedisService} from '@/redis/redis.service'
import {filterParentandChildren} from '@/utils'
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  @InjectRepository(Menu)
  private menuRepository: TreeRepository<Menu>  // 指定为 TreeRepository

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  async create(createMenuDto: CreateMenuDto) {
    console.log(createMenuDto);
    //添加一条菜单数据
    const menu=new Menu()
    menu.parentId=createMenuDto.parentId
    menu.name=createMenuDto.name
    menu.code=createMenuDto.code
    menu.component=createMenuDto.component
    menu.path=createMenuDto.path
    menu.redirect=createMenuDto.redirect
    menu.type=createMenuDto.type
    menu.sort=createMenuDto.sort
    menu.remark=createMenuDto.remark
    menu.isLink=createMenuDto.isLink
    menu.meta=createMenuDto.meta
    if(createMenuDto.parentId!=null){
      const parentMenu=await this.menuRepository.findOneBy({id:createMenuDto.parentId as number})
      if(parentMenu){
        menu.parent=parentMenu
      }
    }
    try{
    await this.menuRepository.save(menu)
      return '创建成功'
    }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateMenuDto: UpdateMenuDto) {
     try{
      const {id}=updateMenuDto
      const menu=await this.menuRepository.findOneBy({id})
      if(!menu){
        throw new HttpException('菜单不存在',HttpStatus.BAD_REQUEST)
      }
      menu.parentId=updateMenuDto.parentId
      menu.name=updateMenuDto.name
      menu.code=updateMenuDto.code
      menu.component=updateMenuDto.component
      menu.path=updateMenuDto.path
      menu.redirect=updateMenuDto.redirect
      menu.type=updateMenuDto.type
      menu.sort=updateMenuDto.sort
      menu.remark=updateMenuDto.remark
      menu.isLink=updateMenuDto.isLink
      menu.meta=updateMenuDto.meta
      await this.menuRepository.save(menu)
      return '更新成功'
     }catch(error){
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
     }
  }

async remove(id: number|string) {
   try{
      const menu=await this.menuRepository.findOneBy({id:id as number})
      if(!menu){
        throw new HttpException('菜单不存在',HttpStatus.BAD_REQUEST)
      }
      await this.menuRepository.remove(menu)
     return '删除成功'
   }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
   }
}

  async findMany(keyword:string){
   try{
    const sortMenuTree=(menu: Menu): Menu =>{
      // 如果有子菜单，先对子菜单进行排序
      if (menu.children && menu.children.length > 0) {
        menu.children = menu.children.map(child => sortMenuTree(child)).sort((a, b) => a.sort - b.sort);
      }
      return menu;
    }
     if(!keyword){
      // 如果没有关键字，返回所有菜单
      const allMenus = await this.menuRepository.findTrees();
     const trees = allMenus.map(menu => sortMenuTree(menu));
      // 对顶级菜单进行排序
      trees.sort((a, b) => a.sort - b.sort);
      return trees
     }
    // 使用 queryBuilder 查找所有meta.title模糊匹配的菜单
    const matchedMenus = await this.menuRepository.createQueryBuilder("menu")
      .where(`menu.meta->>'$.title' LIKE :title`, { title: `%${keyword}%` })
      .getMany();

        // 为每个找到的菜单加载其子菜单树，并应用排序
        const unsortedTrees = await Promise.all(
          matchedMenus.map(async menu => {
            const tree = await this.menuRepository.findDescendantsTree(menu);
            return sortMenuTree(tree); // 对树进行排序
          })
        );
        // 对顶级菜单进行排序
      const  trees = unsortedTrees.sort((a, b) => a.sort - b.sort);
    return trees
   }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
   }
  }

  async findAll(){
      try{
        const sortMenuTree=(menu: Menu): Menu =>{
          // 如果有子菜单，先对子菜单进行排序
          if (menu.children && menu.children.length > 0) {
            menu.children = menu.children.map(child => sortMenuTree(child)).sort((a, b) => a.sort - b.sort);
          }
          return menu;
        }
      const allMenus = await this.menuRepository.findTrees();
      const trees = allMenus.map(menu => sortMenuTree(menu));
      // 对顶级菜单进行排序
      trees.sort((a, b) => a.sort - b.sort);
      const hadleTree=(trees:Menu[])=>{
        trees.forEach(tree=>{
          if(tree.children){
            hadleTree(tree.children)
          }
          (tree as any).title=tree.meta.title
        })
      }
      hadleTree(trees)
      return trees
      }catch(error){
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
      }
  }

  async findUserMenu(id:number){
    try{
      const user=await this.userRepository.findOne({
        where:{
          id
        },
        relations:['roles','roles.menus']
      })
      if(!user){
        throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
      }
      //筛选出所有菜单id并去重
      const menus = user.roles.map(role => role.menus).flat();
      const uniqueMenus = Array.from(new Set(menus.map(menu => menu.id)))
          .map(id => {
              return menus.find(menu => menu.id === id);
          });
      //根据menuIds查出符合条件的树形菜单
      const menuArray:Menu[]=uniqueMenus.filter(item=>item.type==1)
      const menuTree=filterParentandChildren(menuArray)
      const sortMenuTree=(menu: Menu): Menu =>{
        // 如果有子菜单，先对子菜单进行排序
        if (menu.children && menu.children.length > 0) {
          menu.children = menu.children.map(child => sortMenuTree(child)).sort((a, b) => a.sort - b.sort);
        }
        return menu;
      }
      menuTree.forEach(menu=>sortMenuTree(menu))
      const menuList=menuTree.sort((a, b) => a.sort - b.sort)
      const buttonList=uniqueMenus.filter(item=>item.type==2).map(obj=>obj.code)
      const userInfo=JSON.parse(JSON.stringify(user))
       delete userInfo.roles
       delete userInfo.password
      return {
        buttonList,
        menuList,
        userInfo
      }
    }catch(error){
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
