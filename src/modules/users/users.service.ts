import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, 'HelperMongo')
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    let email = createUserDto.email;
    let user = await this.userModel.findOne({ email } , { id: 1, firstName: 1, lastName: 1, email: 1 });
    if (user) {
      throw new Error(
        'Su dirección de correo electrónico está asociada a una cuenta existente. Para acceder a su perfil, le invitamos a iniciar sesión',
      );
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    await createdUser.save();
    return await this.userModel.findOne({ email } , { id: 1, firstName: 1, lastName: 1, email: 1 });
  }

  async findAll(): Promise<User[]> {
    return this.userModel
      .find({}, { id: 1, firstName: 1, lastName: 1, email: 1 })
      .exec();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel
      .findById(id, { id: 1, firstName: 1, lastName: 1, email: 1 })
      .exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({email} , { id: 1, firstName: 1, lastName: 1, email: 1 }).exec();
  }
}
