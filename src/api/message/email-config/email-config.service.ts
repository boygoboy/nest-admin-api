import { Injectable } from '@nestjs/common';
import { CreateEmailConfigDto } from './dto/create-email-config.dto';
import { UpdateEmailConfigDto } from './dto/update-email-config.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, Like } from 'typeorm';
import { EmailConfig } from './entities/email-config.entity';

@Injectable()
export class EmailConfigService {
    @InjectRepository(EmailConfig)
    private emailConfigRepository: Repository<EmailConfig>;

  create(createEmailConfigDto: CreateEmailConfigDto) {
    return 'This action adds a new emailConfig';
  }

  update(updateEmailConfigDto: UpdateEmailConfigDto) {
    return `This action updates a # emailConfig`;
  }

  getEmailConfigList(){

  }

  getEmailConfigDetail(id: number){

  }

  remove(id: number) {

  }

}
