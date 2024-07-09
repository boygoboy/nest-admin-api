import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like } from 'typeorm';
import { User } from '@/api/system/user/entities/user.entity';
import { Role } from '@/api/system/role/entities/role.entity';
import { Menu } from '@/api/system/menu/entities/menu.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordDto } from './dto/password.dto';
import { StatusDto } from './dto/status.dto';
import { QueryDto } from './dto/query.dto';
import { PageResponseVo } from './vo/page-response.vo';
import { md5 } from '@/utils';
import {
  paginate,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { IResponseData, IResponsePagerData } from '@/utils/types';
import { formatResponsePagerData } from '@/utils/index';

@Injectable()
export class UserService {

  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectRepository(Role)
  private roleRepository: Repository<Role>;

  @InjectRepository(Menu)
  private menuRepository: Repository<Menu>;

  async create(createUserDto: CreateUserDto) {
    try {
        let isPass=await this.someExist(createUserDto.mobile, createUserDto.email, createUserDto.username)
            if(isPass){
                throw new HttpException('用户名、邮箱或者手机号已存在', HttpStatus.BAD_REQUEST)
            }
      const user = new User();
      user.username = createUserDto.username
      user.nickName = createUserDto.nickName
      user.accountStatus = createUserDto.accountStatus
      user.password = md5(createUserDto.password)
      user.email = createUserDto.email
      user.mobile = createUserDto.mobile
      user.remark = createUserDto.remark
      const roles = await this.roleRepository.findBy({
        id: In(createUserDto.roleIds)
      })
      user.roles = roles
      await this.userRepository.save(user)
      return '创建用户成功'
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async update(updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({ id: updateUserDto.id })
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
      }
      let isPass=await this.someExist(updateUserDto.mobile, updateUserDto.email, updateUserDto.username,updateUserDto.id)
        if(isPass){
            throw new HttpException('用户名、邮箱或者手机号已存在', HttpStatus.BAD_REQUEST)
        }
      user.username = updateUserDto.username
      user.nickName = updateUserDto.nickName
      user.accountStatus = updateUserDto.accountStatus
      user.email = updateUserDto.email
      user.mobile = updateUserDto.mobile
      user.remark = updateUserDto.remark
      const roles = await this.roleRepository.findBy({
        id: In(updateUserDto.roleIds)
      })
      user.roles = roles
      await this.userRepository.save(user)
      return '更新用户成功'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updatePassword(passwordDto: PasswordDto) {
    try {
      const { userId, newPassword, repPassword } = passwordDto
      const user = await this.userRepository.findOneBy({ id: userId })
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
      }
      if (newPassword !== repPassword) {
        throw new HttpException('两次密码不一致', HttpStatus.BAD_REQUEST)
      }
      user.password = md5(newPassword)
      await this.userRepository.save(user)
      return '重置密码成功'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateStatus(id: number, statusDto: StatusDto) {
    try {
      const { userId, accountStatus } = statusDto
      const user = await this.userRepository.findOneBy({ id: userId })
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
      }
      if (userId === id && accountStatus === false) {
        throw new HttpException('不能禁用自己', HttpStatus.BAD_REQUEST)
      }
      user.accountStatus = accountStatus
      await this.userRepository.save(user)
      return '更新状态成功'
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOneBy({ id: id })
      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
      }
      if (user.username == 'back_admin') {
        throw new HttpException('超级管理员不能删除', HttpStatus.BAD_REQUEST)
      }
      if(user.accountStatus){
        throw new HttpException('用户未禁用，不能删除', HttpStatus.BAD_REQUEST)
      }
      await this.userRepository.remove(user)
      return '删除用户成功'
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findMany(query: QueryDto): Promise<IResponseData<PageResponseVo>> {
    try {
      const { current: page, size: limit, keyword = '' } = query
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
      const users: IResponsePagerData<PageResponseVo> = await paginate<User>(this.userRepository, options, searchOptions);
      users.items.forEach((user: PageResponseVo) => {
        user.roleIds = user.roles.map(role => role.id)
        delete user.roles
        delete user.password
      })
      return formatResponsePagerData<PageResponseVo>(users)
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findAll() {
    try {
      const users: PageResponseVo[] = await this.userRepository.find()
      users.forEach(item => delete item.password)
      return users
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async someExist(mobile: string, email: string, username: string,userId?:number) {
    try {
      const params = [mobile, email, username].filter(x => x !== undefined)
      if (params.length !== 3) {
        throw new HttpException('传参错误', HttpStatus.BAD_REQUEST)
      }
      const users = await this.userRepository
      .createQueryBuilder("user")
      .where("user.mobile = :mobile", { mobile })
      .orWhere("user.email = :email", { email })
      .orWhere("user.username = :username", { username })
      .getMany();
      if(userId!=undefined){
        if(users.length==0){
            return false
        }else if(users.length==1){
            const user=await this.userRepository.findOneBy({ id: userId })
            if(user.id==users[0].id){
                return false
            }else{
                return true
            }
        }else{
            return true
        }
      }else{
        if(users.length==0){
            return false
        }else{
            return true
        }
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async exist(mobile?: string, email?: string, username?: string) {
    try {
      const params = [mobile, email, username].filter(x => x !== undefined)
      if (params.length !== 1) {
        throw new HttpException('传参错误', HttpStatus.BAD_REQUEST)
      }
      if (mobile) {
        const user = await this.userRepository.findOneBy({ mobile: mobile })
        return user ? true : false
      }
      if (email) {
        const user = await this.userRepository.findOneBy({ email: email })
        return user ? true : false
      }
      if (username) {
        const user = await this.userRepository.findOneBy({ username: username })
        return user ? true : false
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      }
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

}
