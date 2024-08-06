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

    /* 
        Obtener informacion del Cliente
      */
    let accountHelper = account.helper;
    let accountCustomer = account.customer;
    let searchCoordinates = [];

    if (accountHelper) {
      if (accountHelper.location.coordinates.length === 0) {
        if (accountCustomer.location.coordinates.length != 0) {
          searchCoordinates = accountCustomer.location.coordinates;
        }
      } else {
        searchCoordinates = accountHelper.location.coordinates;
      }
    } else {
      if (accountCustomer.location.coordinates.length != 0) {
        searchCoordinates = accountCustomer.location;
      }
    }

    let filters = {};
    if (accountHelper) {
      filters['_id'] = { $ne: accountHelper._id };
    }

    if (queryCustomerDto.distanceRange) {
      /* 
          Busqueda por rango de distancia
        */
      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: 0,
          $maxDistance: queryCustomerDto.distanceRange,
        },
      };
    }

    if (queryCustomerDto.minDistance && queryCustomerDto.maxDistance) {
      if (queryCustomerDto.minDistance >= queryCustomerDto.maxDistance) {
        return globalResponseApi(
          res,
          [],
          'The minimum distance cannot be greater than or equal to the maximum distance',
          400,
        );
      }
      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: queryCustomerDto.minDistance,
          $maxDistance: queryCustomerDto.maxDistance,
        },
      };
    }

    if (Object.keys(filters).length === 0) {
      /* 
          Por default si no hay filtros buscar siempre a 500 metros
        */
      filters['location'] = {
        $near: {
          $geometry: searchCoordinates,
          $minDistance: 0,
          $maxDistance: 500,
        },
      };
    }

    if (queryCustomerDto.areas && queryCustomerDto.areas.length > 0) {
      filters['areas'] = { $in: queryCustomerDto.areas };
    }

    if (queryCustomerDto.jobs && queryCustomerDto.jobs.length > 0) {
      filters['jobs'] = { $in: queryCustomerDto.jobs };
    }

    if (queryCustomerDto.specials && queryCustomerDto.specials.length > 0) {
      filters['specials'] = { $in: queryCustomerDto.specials };
    }

    let response = await this.clientSearchService.search(filters);
    return globalResponseApi(res, response, 'Search Helper', 200);
  }
}
