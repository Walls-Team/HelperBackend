import { Controller, Get, Res, Param , Query , UseGuards} from '@nestjs/common';
import { JobService } from './job.service';
import { globalResponseApi } from 'src/utils/response';
import { query, Response } from 'express';
import {AuthGuard} from 'src/auth.guard'

@Controller('job')
export class JobController {
  constructor(
    private readonly jobService: JobService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@Res() res: Response , @Query() query) {
    try {

      const jobs = await this.jobService.findAll(query);
      return globalResponseApi(res, jobs);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Res() res: Response, @Param('id') id: string) {
    try {
      const job = await this.jobService.findOne(id);
      if (!job) {
        return globalResponseApi(res, null, 'Job not found', 404);
      }

      return globalResponseApi(res, job);
    } catch (err) {
      return globalResponseApi(res, null, err.message, 500);
    }
  }
}
