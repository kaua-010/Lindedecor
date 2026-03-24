import { Controller, Get, Query } from '@nestjs/common';
import { CuponsService } from './cupons.service';

@Controller('cupons')
export class CuponsController {
  constructor(private service: CuponsService) {}

  @Get('validar')
  async validar(@Query('codigo') codigo: string, @Query('total') total: string) {
    return this.service.validar(codigo, parseFloat(total) || 0);
  }
}
