// Nest Imports
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';

// local imports
import { AuthGuard } from 'src/auth.guard';

import { AccountService } from 'src/modules/account/account.service';
import { CreateAccountDto } from 'src/modules/account/dto/create-account.dto';
import { UpdateAccountDto } from 'src/modules/account/dto/update-account.dto';
import { globalResponseApi } from 'src/utils/response';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createAccountDto: CreateAccountDto,
  ) {
    let user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (account) {
      return globalResponseApi(res, null, 'You already have an account', 400);
    }
    return this.accountService.create(createAccountDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAccountUser(@Res() res: Response, @Req() req: Request) {
    let user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }
    let accounts = await this.accountService.findAll(user);
    return globalResponseApi(res, accounts);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateAccountDto: UpdateAccountDto,
  ) {
    let user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (updateAccountDto.user) {
      return globalResponseApi(res, null, 'You cannot update the user', 400);
    }

    if (account.id !== id) {
      return globalResponseApi(
        res,
        null,
        'This account does not belong to you',
        400,
      );
    }

    let update = await this.accountService.update(id, updateAccountDto);
    if (!update) {
      return globalResponseApi(res, null, 'Account not found', 404);
    } else {
      return globalResponseApi(
        res,
        update,
        'Account updated successfully',
        200,
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ) {

    let user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    // enviar correo de confirmacion

    // confirmar eliminacion

    // pregunta secretas


    let remove = await this.accountService.remove(id);
    if (!remove) {
      return globalResponseApi(res, null, 'Account not found', 404);
    } else {
      return globalResponseApi(res, null, 'Account deleted successfully', 200);
    }
  }
}
