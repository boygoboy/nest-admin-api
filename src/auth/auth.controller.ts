import { Controller, Get, Post, Body, Put, Param, Delete, Query,Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token')
  async haneleLogin(@Body() data: LoginDto) {
    return await this.authService.haneleLogin(data);
  }
  @Get('/refreshtoken')
  async refreshtoken(@Query('refreshToken') refreshToken:string,@Headers('Authorization') authorization:string) {
     return await this.authService.refreshtoken(refreshToken,authorization);
  }
  @Get('/logout')
  async logout( @Query('refreshToken') refreshToken:string,@Headers('Authorization') authorization:string) {
     return await this.authService.logout(refreshToken,authorization);
  }
}
