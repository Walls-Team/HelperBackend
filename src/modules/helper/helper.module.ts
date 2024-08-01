import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperService } from './helper.service';
import { HelperSearchService } from './helper.search.service';
import { HelperController } from './helper.controller';
import { HelperSearchController } from 'src/modules/helper/helper.search.controller';
import { Helper, HelperSchema } from 'src/modules/helper/schemas/helper.schema';
import { AccountService } from '../account/account.service';
import { Account, AccountSchema } from '../account/schemas/account.schema';

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
  controllers: [HelperController, HelperSearchController],
  providers: [HelperService, HelperSearchService, AccountService],
})
export class HelperModule {}
