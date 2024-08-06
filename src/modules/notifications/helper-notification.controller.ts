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
import { AuthGuard } from 'src/auth.guard';
import { Request, Response } from 'express';
import { globalResponseApi } from 'src/utils/response';
import { HelperNotificationService } from './helper-notification.service';
import { HelperNotificationDto } from 'src/modules/notifications/dto/helperNotification.dto';
/* 
  Servicios externos
*/
import { HelperSearchService } from 'src/modules/helper/helper.search.service';
import { SearcHelperService } from 'src/modules/helper/utils/helperSearch';
import { AccountService } from '../account/account.service';
import { QueryHelperDto } from 'src/modules/helper/dto/query.helper.dto';

@Controller('helper-notification')
export class HelperNotificationController {
  constructor(
    private readonly notificationService: HelperNotificationService,
    private readonly helperSearchService: HelperSearchService,
    private readonly accountService: AccountService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllNotifications(@Res() res: Response, @Req() req: Request) {
    const notifications = await this.notificationService.findAll();
    return globalResponseApi(res, notifications);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getNotificationById(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const notification = await this.notificationService.findOne(id);
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

    let query = new QueryHelperDto();
    query.distanceRange = 1000;
    query.areas = notification.areas ? notification.areas : [];
    query.jobs = notification.jobs ? notification.jobs : [];
    query.specials = notification.specials ? notification.specials : [];
    let clients = [];
    try {
      const { statuSearch, err, filters } = SearcHelperService.search(
        account,
        query,
      );

      if (statuSearch) {
        clients = await this.helperSearchService.search(filters);
      }
    } catch (error) {
      return globalResponseApi(res, null, error.message, 400);
    }

    notification.clientsNotified = clients.length;
    if (clients.length > 0) {
      /* 
        Generar logica para crear y enviar notificaciones por webscoket
      */
    }

    const notificationCreate =
      await this.notificationService.create(notification);
    return globalResponseApi(res, notificationCreate);
  }

  //   @Put(':id')
  //   updateNotification(
  //     @Param('id') id: string,
  //     @Body() notification: HelperNotification,
  //   ): Promise<HelperNotification> {
  //     return this.notificationService.update(id, notification);
  //   }

  @Delete(':id')
  deleteNotification(@Param('id') id: string) {
    return this.notificationService.delete(id);
  }
}
