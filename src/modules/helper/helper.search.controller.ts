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
} from '@nestjs/common';
import { HelperService } from './helper.service';
import { globalResponseApi } from 'src/utils/response';
import {HelperSearchService} from "src/modules/helper/helper.search.service"
import { AccountService } from 'src/modules/account/account.service';
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';

@Controller('helper')
export class HelperSearchController {
  constructor(
    private readonly helperService: HelperSearchService,
    private readonly accountService: AccountService,
  ) {}

  @Get('search')
  async search(
    @Req() req: Request, 
    @Res() res: Response
  ) {
        let filters = {
            radio: req.query.radio ? req.query.radio : 500,
        }

        console.log('filters', filters);  
        let response = await this.helperService.search();
        console.log('response', response);
        return globalResponseApi(res, response, 'Search Helper', 200)   ;
    }
}
