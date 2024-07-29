import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import {AuthService} from "src/modules/users/users.auth.service"
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { AuthController } from './users.auth.controller';
// import { PassportModule } from '@nestjs/passport';
// import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';


@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'HelperMongo',
    ),
    // PassportModule.register({ defaultStrategy: 'jwt' , session: false }),
    // JwtModule.registerAsync({
    //   useFactory: async (e) => {
    //     const options: JwtModuleOptions = {
    //       privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.JWT_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
    //       publicKey: `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_PUBLIC_KEY}\n-----END PUBLIC KEY-----\n`,
    //       signOptions: {
    //         expiresIn: '3h',
    //         algorithm: 'RS256',
    //       },
    //     };
    //     return options;
    //   },
    // }),
  ],
  controllers: [UsersController , AuthController],
  providers: [UsersService , AuthService],
})
export class UsersModule {}
