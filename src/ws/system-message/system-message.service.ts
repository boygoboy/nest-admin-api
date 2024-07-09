import { Injectable } from '@nestjs/common';
import { CreateSystemMessageDto } from './dto/create-system-message.dto';
import { UpdateSystemMessageDto } from './dto/update-system-message.dto';

@Injectable()
export class SystemMessageService {
  create(createSystemMessageDto: CreateSystemMessageDto) {
    return 'This action adds a new systemMessage';
  }

  findAll() {
    return `This action returns all systemMessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} systemMessage`;
  }

  update(id: number, updateSystemMessageDto: UpdateSystemMessageDto) {
    return `This action updates a #${id} systemMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} systemMessage`;
  }
}
