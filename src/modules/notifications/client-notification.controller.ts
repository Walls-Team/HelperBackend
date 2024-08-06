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

@Controller('client-notification')
export class ClientNotificationController {
  constructor(private clientNotificationService: ClientNotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllNotifications(@Req() req: Request, @Res() res: Response) {
    const notifications = await this.clientNotificationService.findAll();
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
    const notification = await this.clientNotificationService.findOne(id);
    return globalResponseApi(
      res,
      notification,
      'Notification fetched successfully',
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateNotification(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() clientNotificationDto: ClientNotificationDto,
  ) {
    const notification = await this.clientNotificationService.update(
      id,
      clientNotificationDto,
    );
    return globalResponseApi(
      res,
      notification,
      'Notification updated successfully',
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteNotification(
    @Req() req: Request,
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    const message = await this.clientNotificationService.remove(id);
    return globalResponseApi(res, message, 'Notification deleted successfully');
  }
}
