import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas/job.schema';

@Injectable()
export class JobService {

  constructor(
    @InjectModel(Job.name, 'HelperMongo')
    private readonly jobModel: Model<Job>,
  ) {}

  findAll(query) {
    return this.jobModel.find(query, { id: 1, name: 1, description: 1 }).exec();
  }

  findOne(id: string) {
    return this.jobModel.findById(id , { id: 1, name: 1, description: 1 }).exec();
  }
}
