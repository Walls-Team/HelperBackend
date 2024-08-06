import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  Res,
  UseGuards,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { HelperService } from './helper.service';
import { globalResponseApi } from 'src/utils/response';
import { HelperSearchService } from 'src/modules/helper/helper.search.service';
import { AccountService } from 'src/modules/account/account.service';
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';
import { QueryHelperDto } from 'src/modules/helper/dto/query.helper.dto';
import {SearcHelperService} from "src/modules/helper/utils/helperSearch";

@Controller('helper')
export class HelperSearchController {
  constructor(
    private readonly helperService: HelperSearchService,
    private readonly accountService: AccountService,
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Body() queryHelperDto: QueryHelperDto,
  ) {
    /* 
      Search User
    */
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findMeAccount(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (!account.helper && !account.customer) {
      return globalResponseApi(
        res,
        null,
        'You not have Helper account and Customer account',
        400,
      );
    }
    let {statuSearch , err, filters} = SearcHelperService.search(account, queryHelperDto);
    if(!statuSearch){
      return globalResponseApi(res, null, err, 400);
    }

    let response = await this.helperService.search(filters);
    return globalResponseApi(res, response, 'Search Helper', 200);
  }
}
