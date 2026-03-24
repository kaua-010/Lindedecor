import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private service: PedidosService) {}

  @Post()
  async criar(@Body() body: any) {
    return this.service.criar(body);
  }

  @Get()
  async listar() {
    return this.service.findAll();
  }

  @Get('rastrear/:codigo')
  async rastrear(@Param('codigo') codigo: string) {
    return this.service.rastrear(codigo);
  }

  @Put(':id/status')
  async status(@Param('id') id: string, @Body() body: { status: string; codigoRastreio?: string; transportadora?: string }) {
    return this.service.atualizarStatus(id, body.status, body.codigoRastreio, body.transportadora);
  }
}
