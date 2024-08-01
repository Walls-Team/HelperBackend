import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';
import {
  Helper,
  HelperDocument,
} from 'src/modules/helper/schemas/helper.schema';

@Injectable()
export class HelperService {
  constructor(
    @InjectModel(Helper.name, 'HelperMongo')
    private helperModel: Model<HelperDocument>,
  ) {}

  async create(createHelperDto: CreateHelperDto): Promise<HelperDocument> {
    let newPayload = { ...createHelperDto};
    newPayload['location'] = {
      type: 'Point',
      coordinates: [-72.25843380701279, 7.809855217128565],
    };
    console.log(newPayload);
    const createdHelper = new this.helperModel(newPayload);
    let newHelper = await createdHelper.save();

    const helper = await this.helperModel
      .findOne({ _id: newHelper._id })
      .select(['bio', 'title', 'points', 'profileComplete'])
      .populate('areas', '_id name')
      .populate('jobs', '_id name')
      .populate('specials', '_id name');
    return helper;
  }

  async findMe(id: string): Promise<HelperDocument> {
    const helper = await this.helperModel
      .findOne({ _id: id })
      .select(['bio', 'title', 'points', 'profileComplete'])
      .populate('areas', '_id name')
      .populate('jobs', '_id name')
      .populate('specials', '_id name');
    return helper;
  }

  async update(
    id: string,
    updateHelperDto: UpdateHelperDto,
  ): Promise<HelperDocument> {
    const updatedHelper = await this.helperModel
      .findOneAndUpdate({ _id: id }, updateHelperDto, { new: true })
      .select(['bio', 'title', 'points', 'profileComplete'])
      .populate('areas', '_id name')
      .populate('jobs', '_id name')
      .populate('specials', '_id name');
    return updatedHelper;
  }

  async remove(id: string): Promise<boolean> {
    const deletedHelper = await this.helperModel.findOneAndDelete({ _id: id });
    if (deletedHelper) {
      return true;
    } else {
      return false;
    }
  }
}
