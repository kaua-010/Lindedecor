import { Controller, Post } from '@nestjs/common';
import { SheetsService } from './sheets.service';

@Controller('sheets')
export class SheetsController {
  constructor(private service: SheetsService) {}

  @Post('sync')
  async sync() {
    return this.service.syncAll();
  }
}
