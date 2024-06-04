import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/token')
  async haneleLogin(@Body() data: LoginDto) {
    return await this.authService.haneleLogin(data);
  }
}
