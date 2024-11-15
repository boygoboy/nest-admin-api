import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, Query } from '@nestjs/common';
import { EmailConfigService } from './email-config.service';
import { CreateEmailConfigDto } from './dto/create-email-config.dto';
import { UpdateEmailConfigDto } from './dto/update-email-config.dto';
import {RequireLogin, RequirePermission } from '@/common/decorators/custom.decorator';
import { QueryDto } from './dto/query.dto';

@Controller('/message/emailconfig')
@RequirePermission('message:email:config:search')
@RequireLogin()
export class EmailConfigController {
  constructor(private readonly emailConfigService: EmailConfigService) {}

  @Post('/config')
  @RequirePermission('message:email:config:add')
  create(@Body() createEmailConfigDto: CreateEmailConfigDto) {
    
  }

  @Put('/config')
  @RequirePermission('message:email:config:edit')
   update(@Body() updateEmailConfigDto: UpdateEmailConfigDto) {

    }
   
   @Get('/list')
    @RequirePermission('message:email:config:search')
    getEmailConfigList() {

    }

    @Get('/:id')
    @RequirePermission('message:email:config:search')
    getEmailConfigDetail(@Param('id', ParseIntPipe) id: number) {
      
    }

    @Delete('/:id')
    @RequirePermission('message:email:config:delete')
    remove(@Param('id', ParseIntPipe) id: number) {
      
    }

    @Get('/emailtest')
    @RequirePermission('message:email:config:search')
    emailTest(@Query() query: QueryDto) {
      
    }
  
}
