import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';

@Module({
  controllers: [HelperController],
  providers: [HelperService],
})
export class HelperModule {}
