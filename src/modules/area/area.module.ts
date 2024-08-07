import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AreaSchema, Area } from './schemas/area.schema';
import { Job, JobSchema } from 'src/modules/job/schemas/job.schema';
import {
  Specialtie,
  SpecialtieSchema,
} from 'src/modules/specialties/schemas/specialties.schema';
import { JobService } from 'src/modules/job/job.service';
import { SpecialtieService } from 'src/modules/specialties/specialties.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Area.name, schema: AreaSchema }],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [{ name: Specialtie.name, schema: SpecialtieSchema }],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [{ name: Job.name, schema: JobSchema }],
      'HelperMongo',
    ),
  ],
  controllers: [AreaController],
  providers: [AreaService, JobService, SpecialtieService],
})
export class AreaModule {}
