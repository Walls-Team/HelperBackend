import { Controller, Get, Param, Res , UseGuards , Req } from '@nestjs/common';
import { AreaService } from './area.service';
import {globalResponseApi} from "src/utils/response"
import { Response } from 'express';
import {AuthGuard} from 'src/auth.guard'


@Controller('area')
export class AreaController {
  constructor(private readonly areaService: AreaService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Res() res: Response , @Req() req) {
    try{
      const areas = await this.areaService.findAll();
      return globalResponseApi(res , areas)
    }catch(e){
      return globalResponseApi(res , null, e.message, 500)
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Res() res : Response ,@Param('id') id: string) {
    try{
      let area = await this.areaService.findOne(id);
      if(!area){
        return globalResponseApi(res , null, "Area not found", 404)
      }
      return globalResponseApi(res , area)
    }catch(err){
      return globalResponseApi(res , null, err.message, 500)
    }
  }
}
