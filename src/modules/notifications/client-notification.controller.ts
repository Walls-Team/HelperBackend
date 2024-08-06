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
import { ClientNotificationDto } from 'src/modules/notifications/dto/clientNotification.dto';
import { ClientNotificationService } from 'src/modules/notifications/client-notification.service';
import { AccountService } from '../account/account.service';
import { HelperNotificationService } from 'src/modules/notifications/helper-notification.service';

@Controller('client-notification')
export class ClientNotificationController {
  constructor(
    private clientNotificationService: ClientNotificationService,
    private readonly accountService: AccountService,
    private readonly helperNotificationService: HelperNotificationService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllNotifications(@Req() req: Request, @Res() res: Response) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (!account.customer) {
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }
    const notifications = await this.clientNotificationService.findAll(
      account.customer.id,
    );
    return globalResponseApi(
      res,
      notifications,
      'Notifications fetched successfully',
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getNotificationById(
    @Req() req: Request,
    @Res() res: Response,
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

    if (!account.customer) {
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }
    const notification = await this.clientNotificationService.findOne(
      id,
      account.customer.id,
    );
    return globalResponseApi(
      res,
      notification,
      'Notification fetched successfully',
    );
  }

  @Get('read/:id')
  @UseGuards(AuthGuard)
  async updateNotification(
    @Req() req: Request,
    @Res() res: Response,
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

    if (!account.customer) {
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }

    let notification = await this.clientNotificationService.findOne(
      id,
      account.customer.id,
    );

    if (!notification.isRead) {
      try {
        let helperNotification = await this.helperNotificationService.findOne(
          notification.helperNotification.toString(),
          notification.helper.toString(),
        );
        helperNotification.clientsRead += 1;
        await helperNotification.save();
      } catch (e) {}
    } else {
      return globalResponseApi(res, null, 'Notification already read', 400);
    }

    notification.isRead = true;
    await notification.save();

    return globalResponseApi(res, [], 'Notification updated successfully');
  }

  @Post('read-all')
  @UseGuards(AuthGuard)
  async updateAllNotification(@Req() req: Request, @Res() res: Response) {
    const user = req.cookies.scu;
    if (!user) {
      return globalResponseApi(res, null, 'Unauthorized', 401);
    }

    let account = await this.accountService.findAll(user);
    if (!account) {
      return globalResponseApi(res, null, 'You do not have an account', 400);
    }

    if (!account.customer) {
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }

    let notifications = await this.clientNotificationService.findAll(
      account.customer.id,
    );

    if (notifications.length === 0) {
      return globalResponseApi(res, null, 'No notifications found', 400);
    } else {
      notifications.forEach(async (notification) => {
        if (notification.isRead === false) {
          try {
            let helperNotification =
              await this.helperNotificationService.findOne(
                notification.helperNotification.toString(),
                notification.helper?._id.toString(),
              );
            helperNotification.clientsRead += 1;
            await helperNotification.save();
          } catch (e) {
            console.log(e);
          }
        }
        notification.isRead = true;
        await notification.save();
      });
    }

    return globalResponseApi(res, null, 'Notification updated successfully');
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Req() req: Request,
    @Res() res: Response,
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

    if (!account.customer) {
      return globalResponseApi(res, null, 'You  do not have an client', 400);
    }
    await this.clientNotificationService.remove(id, account.customer.id);
    return globalResponseApi(res, null, 'Notification deleted successfully');
  }
}
