/* 
  Nest Imports
*/
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { APP_FILTER } from '@nestjs/core';

// configuration
import { AllExceptionsFilter } from './filter-custom';
import { AreaModule } from './modules/area/area.module';
import { JobModule } from './modules/job/job.module';
import { SpecialtieModule } from './modules/specialties/specialties.module';
import { UsersModule } from './modules/users/users.module';
import { AccountModule } from './modules/account/account.module';
import { ClientModule } from './modules/client/client.module';
import { HelperModule } from './modules/helper/helper.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionName: 'HelperMongo',
    }),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      global: true,
      useFactory: async (e) => {
        const options: JwtModuleOptions = {
          privateKey: `-----BEGIN PRIVATE KEY-----\n${process.env.JWT_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`,
          publicKey: `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_PUBLIC_KEY}\n-----END PUBLIC KEY-----\n`,
          signOptions: {
            expiresIn: '3h',
            algorithm: 'RS256',
          },
        };
        return options;
      },
    }),
    UsersModule,
    AreaModule,
    JobModule,
    SpecialtieModule,
    AccountModule,
    ClientModule,
    HelperModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
