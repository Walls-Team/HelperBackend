import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  async create(
    notification: HelperNotificationDto,
  ): Promise<HelperNotificationDocument> {
    const createdNotification = new this.model(notification);
    return createdNotification.save();
  }

  async findAll(owner: string): Promise<HelperNotificationDocument[]> {
    let notificaciones = this.model
      .find({ owner: owner })
      .select([
        'title',
        'description',
        'message',
        'owner',
        'areas',
        'jobs',
        'specials',
        'radio',
        'clientsNotified',
        'clientsRead',
      ])
      .populate('areas', 'name')
      .populate('jobs', 'name')
      .populate('specials', 'name')
      .populate('owner', 'id , title')
      .sort({ creationDate: -1 })
      .exec();
    return notificaciones;
  }

  async findOne(
    id: string,
    owner: string,
  ): Promise<HelperNotificationDocument> {
    let notification = await this.model
      .findOne({ _id: id })
      .select([
        'title',
        'description',
        'message',
        'owner',
        'areas',
        'jobs',
        'specials',
        'radio',
        'clientsNotified',
        'clientsRead',
      ])
      .populate('areas', 'name')
      .populate('jobs', 'name')
      .populate('specials', 'name')
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.owner.toString() !== owner) {
      throw new ForbiddenException(
        'You do not have permission to access this notification',
      );
    }

    await notification.populate({
      path: 'owner',
      select: 'id title',
    });
    return notification;
  }

  async delete(id: string, owner: string): Promise<string> {
    let notification = await this.model
      .findOne({ _id: id, owner: owner })
      .exec();
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    await this.model.findOneAndDelete({ _id: id, owner: owner }).exec();
    return 'Eliminado';
  }
}
