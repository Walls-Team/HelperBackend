/* 
  Nest Imports
*/
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

// configuration
// import {DatabaseConfig} from 'src/config/database'
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //TypeOrmModule.forRoot(DatabaseConfig.getPostgresConfig()),
    MongooseModule.forRoot(process.env.MONGO_URI, {
      connectionName : 'HelperMongo'
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
