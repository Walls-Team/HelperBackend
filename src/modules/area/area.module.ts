import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema , Area } from './schemas/area.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Area.name, schema: AreaSchema }], "HelperMongo"),
  ],
  controllers: [AreaController],
  providers: [AreaService],
})
export class AreaModule {}
