import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Helper, HelperSchema } from 'src/modules/helper/schemas/helper.schema';
import { Account, AccountSchema } from '../account/schemas/account.schema';
import {
  ClientNotification,
  ClientNotificationSchema,
  HelperNotification,
  HelperNotificationSchema,
} from 'src/modules/notifications/schema/index';
import { HelperNotificationService } from './helper-notification.service';
import { HelperNotificationController } from './helper-notification.controller';
import { ClientNotificationController } from './client-notification.controller';
import { ClientNotificationService } from './client-notification.service';
import { HelperSearchService } from 'src/modules/helper/helper.search.service';
import { AccountService } from '../account/account.service';
import {CustomerSearchService} from "src/modules/client/client.search.service"
import {
  Customer,
  CustomerSchema,
} from 'src/modules/client/schemas/client.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'hpNotification', schema: HelperNotificationSchema }],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [
        {
          name: 'clientNotificationSe',
          schema: ClientNotificationSchema,
        },
      ],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [
        {
          name: Helper.name,
          schema: HelperSchema,
        },
      ],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [
        {
          name: Account.name,
          schema: AccountSchema,
        },
      ],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [
        {
          name: Customer.name,
          schema: CustomerSchema,
        },
      ],
      'HelperMongo',
    ),
  ],
  controllers: [HelperNotificationController, ClientNotificationController],
  providers: [
    HelperNotificationService,
    ClientNotificationService,
    HelperSearchService,
    AccountService,
    CustomerSearchService,
  ],
})
export class NotificationsModule {}
