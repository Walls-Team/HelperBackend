// Nest Imports
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// local imports
import { CreateAccountDto } from 'src/modules/account/dto/create-account.dto';
import {UpdateAccountDto} from 'src/modules/account/dto/update-account.dto';
import { Account, AccountDocument } from 'src/modules/account/schemas/account.schema';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name, 'HelperMongo')
    private accountModel: Model<AccountDocument>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const createdAccount = new this.accountModel(createAccountDto);
    await createdAccount.save();
    return createdAccount;
  }

  findAll(user : string) : Promise<any> {
    return this.accountModel
      .findOne(
        {user},
        {
          id: 1,
          user: 1,
          customer: 1,
          helper: 1,
          country: 1,
          state: 1,
          city: 1,
        },
      )
      .populate('user', 'name email')
      .populate({
        path: 'customer',
        select: '_id businessName',
      })
      .populate({
        path: 'helper',
        select: '_id title',
      })
      .exec();
  }


  update(id: string, updateAccountDto: UpdateAccountDto) {
    return this.accountModel.findByIdAndUpdate(id, updateAccountDto, { new: true })
      .select('id user customer helper country state city')
      .populate('user', 'name email')
      .exec();
  }

  async remove(id: string) {
    return `This action removes a #${id} account`;
  }
}
