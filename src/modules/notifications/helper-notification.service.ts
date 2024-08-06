import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* 
  Schemas
*/
import {
  HelperNotification,
  HelperNotificationDocument,
} from 'src/modules/notifications/schema/index';
import { HelperNotificationDto } from 'src/modules/notifications/dto/helperNotification.dto';


@Injectable()
export class HelperNotificationService {
  constructor(
    @InjectModel('hpNotification', 'HelperMongo')
    private model: Model<HelperNotificationDocument>,
  ) {}

  async create(notification: HelperNotificationDto): Promise<HelperNotificationDocument> {
    const createdNotification = new this.model(notification);
    return createdNotification.save();
  }

  async findAll(): Promise<HelperNotificationDocument[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<HelperNotificationDocument> {
    return this.model.findById(id).exec();
  }

  async update(
    id: string,
    notification: HelperNotificationDto,
  ): Promise<HelperNotificationDocument> {
    return this.model.findByIdAndUpdate(id, notification, { new: true }).exec();
  }

  async delete(id: string): Promise<string> {
    await this.model.findByIdAndDelete(id).exec();
    return 'Eliminado';
  }
}
