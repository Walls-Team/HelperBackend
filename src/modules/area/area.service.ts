import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Area } from './schemas/area.schema';

@Injectable()
export class AreaService {
  constructor(
    @InjectModel(Area.name, 'HelperMongo')
    private readonly areaModel: Model<Area>,
  ) {}

  findAll(search: string) {
    if (search) {
      return this.areaModel
        .find(
          { name: { $regex: search, $options: 'i' } },
          { id: 1, name: 1, description: 1 },
        )
        .exec();
    }

    return this.areaModel.find({}, { id: 1, name: 1, description: 1 }).exec();
  }

  getAllTree(search: string) {
    if (search) {
      return this.areaModel
        .find(
          { name: { $regex: search, $options: 'i' } },
          { id: 1, name: 1, description: 1 },
        )
        .exec();
    }

    return this.areaModel.find({}, { id: 1, name: 1, description: 1 }).exec();
  }

  findOne(id: string) {
    return this.areaModel
      .findById(id, { id: 1, name: 1, description: 1 })
      .exec();
  }
}
