import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avaliacao } from './entities/avaliacao.entity';

@Injectable()
export class AvaliacoesService {
  constructor(@InjectRepository(Avaliacao) private repo: Repository<Avaliacao>) {}

  async findByProduto(produtoId: string) {
    return this.repo.find({ where: { produtoId, aprovado: true }, order: { criadoEm: 'DESC' } });
  }

  async criar(dados: { produtoId: string; nome: string; email: string; nota?: number; texto?: string }) {
    const a = this.repo.create({ ...dados, nota: Math.min(5, Math.max(1, dados.nota || 5)), aprovado: false });
    return this.repo.save(a);
  }
}
