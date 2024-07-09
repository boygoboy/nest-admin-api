import { Module } from '@nestjs/common';
import { SystemMessageService } from './system-message.service';
import { SystemMessageGateway } from './system-message.gateway';

@Module({
  providers: [SystemMessageGateway, SystemMessageService],
})
export class SystemMessageModule {}
