import { Controller, Get, Post, Body, Param, Delete,Put,Query} from '@nestjs/common';
import {ParseIntPipe} from '@/pipe'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordDto } from './dto/password.dto';
import { RequireLogin } from '@/custom.decorator';
import { StatusDto } from './dto/status.dto';
import { QueryDto } from './dto/query.dto';
import {UserInfo} from '@/custom.decorator';
@Controller('/system/user')
@RequireLogin()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Put('/password')
  updatePassword(@Body() passwordDto: PasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Put('/status')
  updateStatus(@UserInfo('id') id:number, @Body() statusDto: StatusDto) {
    return this.userService.updateStatus(id,statusDto);
  }

  @Delete(':id')
  remove(@Param('id',ParseIntPipe ) id: number) {
    return this.userService.remove(id);
  }

  @Get('/search')
  findMany(@Query() query:QueryDto) {
    return this.userService.findMany(query);
  }

  @Get('/list')
  findAll(){
    return this.userService.findAll()
  }

  @Get('/exist')
  exist(@Query('mobile') mobile?:string,@Query('email') email?:string,@Query('username') username?:string){
    return this.userService.exist(mobile,email,username);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

}
