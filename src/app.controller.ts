import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Info')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getInfo(): object {
    return this.appService.getInfo();
  }
}
