import {
  Controller,
  Get,
  Param,
  Res,
  UseGuards,
  Req,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { globalResponseApi } from 'src/utils/response';
import { Response } from 'express';
import { AuthGuard } from 'src/auth.guard';
import { JobService } from 'src/modules/job/job.service';
import { SpecialtieService } from 'src/modules/specialties/specialties.service';

@Controller('area')
export class AreaController {
  constructor(
    private readonly areaService: AreaService,
    private readonly jobService: JobService,
    private readonly specialtieService: SpecialtieService,
  ) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async findAll(
    @Res() res: Response,
    @Req() req,
    @Query('search') search: string,
    @Query('allTree') allTree: Boolean,
  ) {
    try {
      const areas = await this.areaService.findAll(search);
      if (allTree) {
        let areasTree = [];
        if (areas.length > 0) {
          let payload = {};
          for (let i = 0; i < areas.length; i++) {
            payload = {};
            payload['area'] = areas[i];
            payload['jobs'] = await this.jobService.findAll(
              payload['area']._id.toString(),
            );
            if (payload['jobs'].length > 0) {
              payload['specialties'] = await this.specialtieService.findAll(
                payload['area']._id.toString(),
              );
            }
            areasTree.push(payload);
          }
        }

        return globalResponseApi(res, areasTree);
      }

      return globalResponseApi(res, areas);
    } catch (e) {
      return globalResponseApi(res, null, e.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      let area = await this.areaService.findOne(id);
      if (!area) {
        return globalResponseApi(res, null, 'Area not found', 404);
      }
      return globalResponseApi(res, area);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Post('/getAllTree')
  @UseGuards(AuthGuard)
  async getAllTree(@Res() res: Response, @Body('search') search: string) {
    try {
      let areasTree = [];
      const areas = await this.areaService.getAllTree(search);
      if (areas.length > 0) {
        let payload = {};
        for (let i = 0; i < areas.length; i++) {
          payload = {};
          payload['area'] = areas[i];
          payload['jobs'] = await this.jobService.findAll(
            payload['area']._id.toString(),
          );
          if (payload['jobs'].length > 0) {
            payload['specialties'] = await this.specialtieService.findAll(payload['area']._id.toString());
          }
          areasTree.push(payload);
        }
      }
      return globalResponseApi(res, areasTree);
    } catch (e) {
      return globalResponseApi(res, null, e.message, 500);
    }
  }
}
