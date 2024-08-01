import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
} from '@nestjs/common';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';
import { globalResponseApi } from 'src/utils/response';
import { AccountService } from 'src/modules/account/account.service';
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';

@Controller('helper')
export class HelperController {
  constructor(
    private readonly helperService: HelperService,
    private readonly accountService: AccountService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createHelperDto: CreateHelperDto,
  ) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (account.helper) {
      return globalResponseApi(
        res,
        null,
        'You already have a helper account',
        400,
      );
    }

    const helper = await this.helperService.create(createHelperDto);
    await this.accountService.update(account.id, { helper: helper.id });
    return globalResponseApi(res, helper, 'Helper created successfully', 201);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findMe(@Res() res: Response, @Req() req: Request) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (!account.helper) {
      return globalResponseApi(res, null, 'You not have a helper account', 400);
    }

    const helper = await this.helperService.findMe(account.helper?._id);
    if (!helper) {
      return globalResponseApi(res, null, 'Helper not found', 404);
    }
    return globalResponseApi(res, helper, 'Helper found successfully', 200);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateHelperDto: UpdateHelperDto,
  ) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (!account.helper) {
      return globalResponseApi(res, null, 'You not have a helper account', 400);
    }

    if (id !== account.helper._id.toString()) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    const helper = await this.helperService.update(
      account.helper._id,
      updateHelperDto,
    );
    if (!helper) {
      return globalResponseApi(res, null, 'Helper not found', 404);
    }

    return globalResponseApi(res, helper, 'Helper updated successfully', 200);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (id !== account.helper._id.toString()) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    if (!account.helper) {
      return globalResponseApi(res, null, 'You not have a helper account', 400);
    }

    const isDelete = await this.helperService.remove(account.helper._id);
    if (!isDelete) {
      return globalResponseApi(res, null, 'Helper not found', 404);
    }
    return globalResponseApi(res, null, 'Helper deleted successfully', 200);
  }
}
