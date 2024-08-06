import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Customer,
  CustomerDocument,
} from 'src/modules/client/schemas/client.schema';

@Injectable()
export class CustomerSearchService {
  constructor(
    @InjectModel(Customer.name, 'HelperMongo')
    private customerModel: Model<CustomerDocument>,
  ) {}

  async search(filters: any): Promise<CustomerDocument[]> {
    return this.customerModel
      .find(filters)
      .select(['businessName'])
      .populate('areas', '_id name')
      .populate('jobs', '_id name')
      .populate('specials', '_id name')
      .exec();
  }
}
