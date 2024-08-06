import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClientNotificationDocument } from 'src/modules/notifications/schema/index';
import { ClientNotificationDto } from 'src/modules/notifications/dto/clientNotification.dto';

@Injectable()
export class ClientNotificationService {
  constructor(
    @InjectModel('clientNotificationSe', 'HelperMongo')
    private readonly clientNotificationModel: Model<ClientNotificationDocument>,
  ) {}

  async create(
    clientNotificationDto: ClientNotificationDto,
  ): Promise<ClientNotificationDocument> {
    const createdNotification = new this.clientNotificationModel(
      clientNotificationDto,
    );
    return createdNotification.save();
  }

  async findAll(customer: string): Promise<any[]> {
    return this.clientNotificationModel
      .find({
        customer: customer,
      })
      .select(['title', 'message', 'isRead', 'customer','helperNotification'])
      .populate('areas', 'name')
      .populate('jobs', 'name')
      .populate('specials', 'name')
      .populate('helper', 'id title')
      .sort({ creationDate: -1 })
      .exec();
  }

  async findOne(
    id: string,
    customer: string,
  ): Promise<ClientNotificationDocument> {
    let notification = await this.clientNotificationModel
      .findById(id)
      .select(['title', 'message', 'isRead', 'customer'])
      .populate('areas', 'name')
      .populate('jobs', 'name')
      .populate('specials', 'name')
      .populate('helper', 'id title')
      .exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.customer.toString() !== customer) {
      throw new ForbiddenException(
        'You do not have permission to access this notification',
      );
    }

    return notification;
  }

  async update(
    id: string,
    clientNotificationDto: ClientNotificationDto,
  ): Promise<ClientNotificationDocument> {
    return this.clientNotificationModel
      .findByIdAndUpdate(id, clientNotificationDto, { new: true })
      .exec();
  }

  async remove(id: string, customer: string): Promise<string> {
    let notification = await this.clientNotificationModel.findById(id).exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.customer.toString() !== customer) {
      throw new ForbiddenException(
        'You do not have permission to access this notification',
      );
    }

    await this.clientNotificationModel.findByIdAndDelete(id).exec();
    return 'Notification deleted successfully';
  }
}
