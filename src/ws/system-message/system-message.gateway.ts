import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { SystemMessageService } from './system-message.service';
import { CreateSystemMessageDto } from './dto/create-system-message.dto';
import { UpdateSystemMessageDto } from './dto/update-system-message.dto';

@WebSocketGateway()
export class SystemMessageGateway {
  constructor(private readonly systemMessageService: SystemMessageService) {}

  @SubscribeMessage('createSystemMessage')
  create(@MessageBody() createSystemMessageDto: CreateSystemMessageDto) {
    return this.systemMessageService.create(createSystemMessageDto);
  }

  @SubscribeMessage('findAllSystemMessage')
  findAll() {
    return this.systemMessageService.findAll();
  }

  @SubscribeMessage('findOneSystemMessage')
  findOne(@MessageBody() id: number) {
    return this.systemMessageService.findOne(id);
  }

  @SubscribeMessage('updateSystemMessage')
  update(@MessageBody() updateSystemMessageDto: UpdateSystemMessageDto) {
    return this.systemMessageService.update(updateSystemMessageDto.id, updateSystemMessageDto);
  }

  @SubscribeMessage('removeSystemMessage')
  remove(@MessageBody() id: number) {
    return this.systemMessageService.remove(id);
  }
}
