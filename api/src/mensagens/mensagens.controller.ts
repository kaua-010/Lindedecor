import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MensagensService } from './mensagens.service';

@Controller('mensagens')
export class MensagensController {
  constructor(private service: MensagensService) {}

  @Post()
  async criar(@Body() body: any) {
    return this.service.criar(body);
  }

  @Get()
  async listar(@Query('tipo') tipo?: string) {
    return this.service.findAll(tipo);
  }
}
