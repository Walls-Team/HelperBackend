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
} from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';
import { globalResponseApi } from 'src/utils/response';
import { HelperNotificationService } from './helper-notification.service';
import { HelperNotificationDto } from 'src/modules/notifications/dto/helperNotification.dto';
/* 
  Servicios externos
*/
import { ClientNotificationService } from 'src/modules/notifications/client-notification.service';
import { HelperSearchService } from 'src/modules/helper/helper.search.service';
import { AccountService } from '../account/account.service';
import { QueryHelperDto } from 'src/modules/helper/dto/query.helper.dto';
import { SearcHelperService } from 'src/modules/helper/utils/helperSearch';
import { CustomerSearchService } from 'src/modules/client/client.search.service';
import { SearcClientService } from 'src/modules/client/utils/clientSearch';
import { ClientNotificationDto } from 'src/modules/notifications/dto/clientNotification.dto';

@Controller('helper-notification')
export class HelperNotificationController {
  constructor(
    private readonly notificationService: HelperNotificationService,
    private readonly clientNotificationService: ClientNotificationService,
    private readonly customerSearchService: CustomerSearchService,
    private readonly helperSearchService: HelperSearchService,
    private readonly accountService: AccountService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllNotifications(@Res() res: Response, @Req() req: Request) {
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
    const notifications = await this.notificationService.findAll(
      account.helper.id,
    );
    return globalResponseApi(res, notifications);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getNotificationById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
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
    const notification = await this.notificationService.findOne(
      id,
      account.helper.id,
    );
    return globalResponseApi(res, notification);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createNotification(
    @Res() res: Response,
    @Req() req: Request,
    @Body() notification: HelperNotificationDto,
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

    notification.owner = account.helper.id;

    let query = new QueryHelperDto();
    query.distanceRange = 1000;
    query.areas = notification.areas ? notification.areas : [];
    query.jobs = notification.jobs ? notification.jobs : [];
    query.specials = notification.specials ? notification.specials : [];
    let clients = [];
    try {
      const { statuSearch, err, filters } = SearcClientService.search(
        account,
        query,
      );

      if (statuSearch) {
        clients = await this.customerSearchService.search(filters);
      }
    } catch (error) {
      return globalResponseApi(res, null, error.message, 400);
    }

    notification.clientsNotified = clients.length;
    const notificationCreate =
      await this.notificationService.create(notification);

    if (clients.length > 0) {
      /* 
          Generar lógica para crear y enviar notificaciones por websocket
      */
      for (const client of clients) {
        try {
          const clientNotification = new ClientNotificationDto();
          clientNotification.customer = client.id;
          clientNotification.title = notification.title;
          clientNotification.message = notification.message;
          clientNotification.helper = account.helper.id;
          clientNotification.helperNotification = notificationCreate.id;
          clientNotification.areas = notification.areas;
          clientNotification.jobs = notification.jobs;
          clientNotification.specials = notification.specials;
          await this.clientNotificationService.create(clientNotification);
          /*
            Enviar al socket
          */
        } catch (error) {
          console.log('Error al enviar notificación', error);
        }
      }
    }

    return globalResponseApi(res, notificationCreate);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Res() res: Response,
    @Req() req: Request,
    @Param('id') id: string,
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
    let response = await this.notificationService.delete(id, account.helper.id);
    return globalResponseApi(res, null, response);
  }
}
