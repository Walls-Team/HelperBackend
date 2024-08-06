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
import { globalResponseApi } from 'src/utils/response';
import { CustomerSearchService } from 'src/modules/client/client.search.service';
import { AccountService } from 'src/modules/account/account.service';
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';
import { QueryClientDto } from 'src/modules/client/dto/search.dto';
import {SearcClientService} from 'src/modules/client/utils/clientSearch';
@Controller('client')
export class ClientSearchController {
  constructor(
    private readonly clientSearchService: CustomerSearchService,
    private readonly accountService: AccountService,
  ) {}

  @Post('search')
  @UseGuards(AuthGuard)
  async search(
    @Req() req: Request,
    @Res() res: Response,
    @Body() queryCustomerDto: QueryClientDto,
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
    let {statuSearch, err , filters} = SearcClientService.search(account, queryCustomerDto);
    if (!statuSearch) {
      return globalResponseApi(res, null, err, 400);
    }
    let response = await this.clientSearchService.search(filters);
    return globalResponseApi(res, response, 'Search Helper', 200);
  }
}
