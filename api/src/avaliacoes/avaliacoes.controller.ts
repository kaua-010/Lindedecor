import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AvaliacoesService } from './avaliacoes.service';

@Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private service: AvaliacoesService) {}

  @Get('produto/:id')
  async porProduto(@Param('id') id: string) {
    return this.service.findByProduto(id);
  }

  @Post()
  async criar(@Body() body: any) {
    return this.service.criar(body);
  }
}
