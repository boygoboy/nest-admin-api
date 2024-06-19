import { Injectable ,HttpException,HttpStatus} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  In, Repository,Like } from 'typeorm';
import {User} from '@/user/entities/user.entity';
import {Role} from '@/role/entities/role.entity';
import {Menu} from '@/menu/entities/menu.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PasswordDto} from './dto/password.dto';
import { StatusDto } from './dto/status.dto';
import { QueryDto } from './dto/query.dto';
import {PageResponseVo} from './vo/page-response.vo';
import { md5 } from '@/utils';
import {
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import {IResponseData,IResponsePagerData} from '@/utils/types';
import {formatResponsePagerData} from '@/utils/index';

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

async updatePassword(passwordDto: PasswordDto){
      try{
      const {userId,newPassword,repPassword}=passwordDto
      const user=await this.userRepository.findOneBy({id:userId})
      if(!user){
        throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
      }
      if(newPassword!==repPassword){
        throw new HttpException('两次密码不一致',HttpStatus.BAD_REQUEST)
      }
      user.password=md5(newPassword)
      await this.userRepository.save(user)
      return '重置密码成功'
      }catch(error){
        if(error instanceof HttpException){
          throw error
        }
        throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
      }
}

async updateStatus(id:number, statusDto:StatusDto){
    try{
      const {userId,accountStatus}=statusDto
      const user=await this.userRepository.findOneBy({id:userId})
      if(!user){
        throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
      }
      if(userId===id){
        throw new HttpException('不能禁用自己',HttpStatus.BAD_REQUEST)
      }
      user.accountStatus=accountStatus
      await this.userRepository.save(user)
      return '更新状态成功'
    }catch(error){
      if(error instanceof HttpException){
        throw error
      }
      throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
    }
}

async remove(id: number) {
  try{
    const user=await this.userRepository.findOneBy({id:id})
    if(!user){
      throw new HttpException('用户不存在',HttpStatus.BAD_REQUEST)
    }
    await this.userRepository.remove(user)
    return '删除用户成功'
  }catch(error){
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async findMany(query:QueryDto) :Promise<IResponseData<PageResponseVo>>{
  try{
   const {current:page,size:limit,keyword=''}=query
    const options: IPaginationOptions = {
      page: page,
      limit: limit,
    }
    const searchOptions = {
      where: [
        { username: Like(`%${keyword}%`) },
        { email: Like(`%${keyword}%`) },
        { mobile: Like(`%${keyword}%`) },
      ],
      relations: ['roles']  // 在这里添加角色关系
    };
    const users:IResponsePagerData<PageResponseVo>= await paginate<User>(this.userRepository, options, searchOptions);
    users.items.forEach((user:PageResponseVo)=>{
      user.roleIds= user.roles.map(role=>role.id)
      delete user.roles
      delete user.password
    })
    return  formatResponsePagerData<PageResponseVo>(users)
  }catch(error){
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async findAll(){
  try{
    const users:PageResponseVo[]=await this.userRepository.find()
    users.forEach(item=>delete item.password)
    return users
  }catch(error){
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

async exist(mobile?:string,email?:string,username?:string){
  try{
    const params=[mobile,email,username].filter(x=>x!==undefined)
    if(params.length!==1){
      throw new HttpException('传参错误',HttpStatus.BAD_REQUEST)
    }
    if(mobile){
      const user=await this.userRepository.findOneBy({mobile:mobile})
      return user?false:true
    }
    if(email){
      const user=await this.userRepository.findOneBy({email:email})
      return user?false:true
    }
    if(username){
      const user=await this.userRepository.findOneBy({username:username})
      return user?false:true
    }
  }catch(error){
    if(error instanceof HttpException){
      throw error
    }
    throw new HttpException(error,HttpStatus.INTERNAL_SERVER_ERROR)
  }
}

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

}
