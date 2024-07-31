import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from './helper.service';
import { HelperController } from './helper.controller';
import {Helper , HelperSchema} from "src/modules/helper/schemas/helper.schema"
import { AccountService } from '../account/account.service';
import { Account , AccountSchema } from '../account/schemas/account.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Helper.name, schema: HelperSchema }],
      'HelperMongo',
    ),
    MongooseModule.forFeature(
      [{ name: Account.name, schema: AccountSchema }],
      'HelperMongo',
    ),
  ],
  controllers: [HelperController],
  providers: [HelperService , AccountService],
})
export class HelperModule {}
