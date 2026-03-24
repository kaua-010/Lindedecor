import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProdutosService } from './produtos.service';

@Controller('produtos')
export class ProdutosController {
  constructor(private service: ProdutosService) {}

  @Get()
  async listar(@Query('categoria') categoria?: string, @Query('busca') busca?: string, @Query('colecao') colecao?: string, @Query('ordenar') ordenar?: string) {
    return this.service.findAll({ categoria, busca, colecao, ordenar });
  }

  @Get('categorias')
  async categorias() {
    return this.service.getCategorias();
  }

  @Get(':id')
  async um(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
