import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JobSchema, Job } from './schemas/job.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Job.name, schema: JobSchema }],
      'HelperMongo',
    ),
  ],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
