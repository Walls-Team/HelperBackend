import { Controller, Get, Param, Res, Query, UseGuards } from '@nestjs/common';
import { SpecialtieService } from './specialties.service';
import { globalResponseApi } from 'src/utils/response';
import { Response } from 'express';
import { AuthGuard } from 'src/auth.guard';

@Controller('specialties')
export class SpecialtieController {
  constructor(private readonly specialtiesService: SpecialtieService) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Res() res: Response,
    @Query('area') area,
    @Query('search') search: string,
  ) {
    try {
      const specialties = await this.specialtiesService.findAll(area, search);
      return globalResponseApi(res, specialties);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const specialty = await this.specialtiesService.findOne(id);
      if (!specialty) {
        return globalResponseApi(res, null, 'Specialty not found', 404);
      }
      return globalResponseApi(res, specialty);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }
}
