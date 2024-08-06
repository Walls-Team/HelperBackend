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

  async search(filters: any): Promise<HelperDocument[]> {
    return this.helperModel
      .find(filters)
      .select(['bio', 'title', 'points', 'profileComplete'])
      .populate('areas', '_id name')
      .populate('jobs', '_id name')
      .populate('specials', '_id name')
      .exec();
  }
}
