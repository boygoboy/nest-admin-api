import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  In, Repository } from 'typeorm';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { md5 } from '@/utils';

@Injectable()
export class UserService {

@InjectRepository(User)
private userRepository: Repository<User>;

@InjectRepository(Role)
private roleRepository: Repository<Role>;

@InjectRepository(Menu)
private menuRepository: Repository<Menu>;

async create(createUserDto: CreateUserDto) {
  try{   
    const user = new User();
    user.username=createUserDto.userName
    user.nickName=createUserDto.nickName
    user.accountStatus=createUserDto.accountStatus
    user.password=md5(createUserDto.password)
    user.email=createUserDto.email
    user.mobile=createUserDto.mobile
    user.remark=createUserDto.remark
    const roles=await this.roleRepository.findBy({
      id:In(createUserDto.roleIds)
    })
    user.roles=roles
    await this.userRepository.save(user)
    return '创建用户成功'
  }catch(error){
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async update(updateUserDto: UpdateUserDto) {
    try{
      const user=await this.userRepository.findOneBy({id:updateUserDto.id})
      if(!user){
        throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
      }
      user.username=updateUserDto.userName
      user.nickName=updateUserDto.nickName
      user.accountStatus=updateUserDto.accountStatus
      user.email=updateUserDto.email
      user.mobile=updateUserDto.mobile
      user.remark=updateUserDto.remark
      const roles=await this.roleRepository.findBy({
        id:In(updateUserDto.roleIds)
      })
      user.roles=roles
      await this.userRepository.save(user)
      return '更新用户成功'
    }catch(error){
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
}


  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }


  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
