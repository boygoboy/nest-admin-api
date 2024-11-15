import { Module } from '@nestjs/common';
import { EmailConfigService } from './email-config.service';
import { EmailConfigController } from './email-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailConfig } from './entities/email-config.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmailConfig])
      ],
  controllers: [EmailConfigController],
  providers: [EmailConfigService],
})
export class EmailConfigModule {}
