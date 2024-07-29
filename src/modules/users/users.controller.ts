import { Controller, Get, Post, Body, Param, Res , UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, verifiedEmaillDto } from './dto/create-user.dto';
import { globalResponseApi } from 'src/utils/response';
import { Response } from 'express';
import { authenticator } from 'otplib';
import { AuthGuard } from 'src/auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    //try {
      const newUser = await this.usersService.create(createUserDto);
      return globalResponseApi(res, newUser, 'User created', 201);
    // } catch (err) {
    //   return globalResponseApi(res, err.message, 'Failed to create user', 500);
    // }
  }

  @Post('send-verification-code')
  async sendVerificationCode(
    @Body('email') email: string,
    @Res() res: Response,
  ) {
    try {
      authenticator.options = {
        digits: 4,
        step: 600, // seconds
      };

      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        return globalResponseApi(res, null, 'User not found', 404);
      }

      const secret = process.env.SECRET_OTP_KEY ?? 'secret';
      const token = authenticator.generate(secret);
      return globalResponseApi(res, { token }, 'Verification code sent', 200);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Post('verified')
  async verifiedEmail(
    @Body() verificationCode: verifiedEmaillDto,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.findOneByEmail(
        verificationCode.email,
      );
      if (!user) {
        return globalResponseApi(res, null, 'User not found', 404);
      }

      const secret = process.env.SECRET_OTP_KEY ?? 'secret';
      let verify = authenticator.check(verificationCode.code, secret);
      if (verify) {
        return globalResponseApi(res, null, 'Email verified', 200);
      } else {
        return globalResponseApi(res, null, 'Invalid verification code', 400);
      }
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Res() res: Response) {
    try {
      const users = await this.usersService.findAll();
      return globalResponseApi(res, users, 'Success', 200);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return globalResponseApi(res, null, 'User not found', 404);
      }
      return globalResponseApi(res, user, 'Success', 200);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }
}
