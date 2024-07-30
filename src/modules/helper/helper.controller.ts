import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HelperService } from './helper.service';
import { CreateHelperDto } from './dto/create-helper.dto';
import { UpdateHelperDto } from './dto/update-helper.dto';

@Controller('helper')
export class HelperController {
  constructor(private readonly helperService: HelperService) {}

  @Post()
  create(@Body() createHelperDto: CreateHelperDto) {
    return this.helperService.create(createHelperDto);
  }

  @Get()
  findAll() {
    return this.helperService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.helperService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHelperDto: UpdateHelperDto) {
    return this.helperService.update(+id, updateHelperDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.helperService.remove(+id);
  }
}
