import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {

ClientNotificationDocument,
} from 'src/modules/notifications/schema/index';
import {ClientNotificationDto} from "src/modules/notifications/dto/clientNotification.dto";


@Injectable()
export class ClientNotificationService {
  constructor(
    @InjectModel('clientNotificationSe', 'HelperMongo')
    private readonly clientNotificationModel: Model<ClientNotificationDocument>,
  ) {}

  async findAll(): Promise<ClientNotificationDocument[]> {
    return this.clientNotificationModel.find().exec();
  }

  async findOne(id: string): Promise<ClientNotificationDocument> {
    return this.clientNotificationModel.findById(id).exec();
  }

  async update(id: string, clientNotificationDto: ClientNotificationDto): Promise<ClientNotificationDocument> {
    return this.clientNotificationModel.findByIdAndUpdate(id, clientNotificationDto, { new: true }).exec();
  }

  async remove(id: string): Promise<string> {
    await this.clientNotificationModel.findByIdAndDelete(id).exec();
    return "Eliminado";
  }
}