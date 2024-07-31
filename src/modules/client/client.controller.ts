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
  UseGuards
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Request, Response } from 'express';
import { globalResponseApi } from 'src/utils/response';
import { AccountService } from '../account/account.service';
import {AuthGuard} from "src/auth.guard"

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService
    , private readonly accountService : AccountService
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Res() res: Response,
    @Req() req: Request,
    @Body() createClientDto: CreateClientDto,
  ) {

    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if(account.customer){
      return globalResponseApi(res, null, 'You already have a client', 400);
    }

    let newClient = await this.clientService.create(createClientDto);
    await this.accountService.update(account.id, {customer: newClient.id});
    return globalResponseApi(res, newClient, 'Client created', 201);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const clients = await this.clientService.findAll();
    return globalResponseApi(res, clients, 'Clients found', 200);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async findOne(
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if(!account.customer){
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }

    let customer = await this.clientService.findOne(account.customer?._id)
    return globalResponseApi(res, customer, 'Cliente actualizado correctamente', 200);
    
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
      const user = req.cookies.scu;
      if (!user) {
        return globalResponseApi(res, null, 'Unauthorized', 401);
      }
  
      let account = await this.accountService.findAll(user);
      if (!account) {
        return globalResponseApi(res, null, 'You do not have an account', 400);
      }
  
      if(!account.customer){
        return globalResponseApi(res, null, 'You  do not have an client', 400);
      }

      if (account.customer._id.toString() !== id) {
        return globalResponseApi(res, null, 'You do not have permission to update this client', 401);
      }

      const updateClient = await this.clientService.update(id, updateClientDto);

      return  globalResponseApi(res, updateClient, 'Client updated', 200);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string) {
      const user = req.cookies.scu;
      if (!user) {
        return globalResponseApi(res, null, 'Unauthorized', 401);
      }
  
      let account = await this.accountService.findAll(user);
      if (!account) {
        return globalResponseApi(res, null, 'You do not have an account', 400);
      }
  
      if(!account.customer){
        return globalResponseApi(res, null, 'You  do not have an client', 400);
      }

      if (account.customer._id.toString() !== id) {
        return globalResponseApi(res, null, 'You do not have permission to update this client', 401);
      }

      const message = await this.clientService.remove(id);
      return globalResponseApi(res, null, message, 200);
  }
}
