import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {Customer , CustomerSchema} from "src/modules/client/schemas/client.schema"
import { AccountService } from '../account/account.service';
import {CustomerSearchService} from 'src/modules/client/client.search.service'
import {ClientSearchController} from "src/modules/client/client.search.controller"
import { Account , AccountSchema } from '../account/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Customer.name, schema: CustomerSchema }],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [{ name: Account.name, schema: AccountSchema }],
      'HelperMongo',
    ),
  ],
  controllers: [ClientController , ClientSearchController],
  providers: [ClientService , AccountService , CustomerSearchService],
})
export class ClientModule {}
