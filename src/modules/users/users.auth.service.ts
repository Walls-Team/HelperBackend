// Nest Imports
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';

// External Imports
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';

// Local Modules and Imports
import { AuthLoginDto } from 'src/modules/users/dto/auth-login.dto';
import { AuthRefreshDto } from 'src/modules/users/dto/auth-refresh.dto';
import { User, UserDocument } from 'src/modules/users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'HelperMongo')
    private modelUser: Model<UserDocument>,
    private jwtSvc: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const user = await this.modelUser.findOne({ email: authLoginDto.email });
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const isPasswordValid = await bcrypt.compare(
      authLoginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Contraseña incorrecta');
    }

    const { id } = user;

    let tokens = await this.generateTokens({ sub:id })

    return  {
      tokens,
      id
    };
  }

  async refresh(authRefreshDto: AuthRefreshDto) {
    let refreshTokenPublicKey = `-----BEGIN PUBLIC KEY-----\n${process.env.JWT_REFRESH_PUBLIC_KEY}\n-----END PUBLIC KEY-----\n`
    let verifiedToken = this.jwtSvc.verify(authRefreshDto.refreshToken, {
      publicKey: refreshTokenPublicKey,
    });
    if (!verifiedToken) {
      throw new Error('Token inválido');
    }
    const {sub} = verifiedToken
    return this.generateTokens({sub}); ;
  }

  private async generateTokens(payload: any) {
    let refreshTokenPrivateKey = `-----BEGIN PRIVATE KEY-----\n${process.env.JWT_REFRESH_PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`;
    return {
      access_token: await this.jwtSvc.signAsync(payload),
      refresh_token: this.jwtSvc.sign(payload, {
        privateKey: refreshTokenPrivateKey,
        expiresIn: '3d',
        algorithm: 'RS256',
      }),
    };
  }
}
