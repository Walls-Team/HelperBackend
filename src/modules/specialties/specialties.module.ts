import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpecialtieService } from './specialties.service';
import { Specialtie, SpecialtieSchema } from './schemas/specialties.schema';
import { SpecialtieController } from './specialties.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Specialtie.name, schema: SpecialtieSchema },
    ],'HelperMongo',),
  ],
  controllers: [SpecialtieController],
  providers: [SpecialtieService],
})
export class SpecialtieModule {}
