import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { ParseIntPipe } from '@/common/pipe'
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordDto } from './dto/password.dto';
import { RequireLogin } from '@/common/decorators/custom.decorator';
import { StatusDto } from './dto/status.dto';
import { QueryDto } from './dto/query.dto';
import { UserInfo } from '@/common/decorators/custom.decorator';
import { RequirePermission } from '@/common/decorators/custom.decorator'
@Controller('/system/user')
@RequirePermission('system:user:search')
@RequireLogin()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @RequirePermission('system:user:add')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put()
  @RequirePermission('system:user:edit')
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }

  @Put('/password')
  @RequirePermission('system:user:password')
  updatePassword(@Body() passwordDto: PasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Put('/status')
  @RequirePermission('system:user:edit')
  updateStatus(@UserInfo('id') id: number, @Body() statusDto: StatusDto) {
    return this.userService.updateStatus(id, statusDto);
  }

  @Delete(':id')
  @RequirePermission('system:user:delete')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @Get('/search')
  findMany(@Query() query: QueryDto) {
    return this.userService.findMany(query);
  }

  @Get('/list')
  @RequirePermission('require:login')
  findAll() {
    return this.userService.findAll()
  }

  @Get('/exist')
  exist(@Query('mobile') mobile?: string, @Query('email') email?: string, @Query('username') username?: string) {
    return this.userService.exist(mobile, email, username);
  }

}
