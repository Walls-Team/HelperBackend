import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Helper,
  HelperDocument,
} from 'src/modules/helper/schemas/helper.schema';

@Injectable()
export class HelperSearchService {
  constructor(
    @InjectModel(Helper.name, 'HelperMongo')
    private helperModel: Model<HelperDocument>,
  ) {}

  async search(): Promise<HelperDocument[]> {
    return this.helperModel
      .find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [-72.25361691745873, 7.8119384874218385],
            },
            $minDistance: 100,
            $maxDistance: 1500,
          },
        },
      })
      .exec();
  }
}
