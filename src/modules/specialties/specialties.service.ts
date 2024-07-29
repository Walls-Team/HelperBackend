import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Specialtie } from './schemas/specialties.schema';
import { Model } from 'mongoose';

@Injectable()
export class SpecialtieService {
  constructor(
    @InjectModel(Specialtie.name, 'HelperMongo')
    private readonly specialModel: Model<Specialtie>,
  ) {}

  create(createSpecialtieDto: any) {
    return this.specialModel.create({
      name: 'Specialty 1',
      description: 'Description 1',
    });
  }

  findAll(query) {
    return this.specialModel.find(query, { id: 1, name: 1, description: 1 }).exec();
  }

  findOne(id: string) {
    return this.specialModel
      .findById(id, { id: 1, name: 1, description: 1 })
      .exec();
  }
}
