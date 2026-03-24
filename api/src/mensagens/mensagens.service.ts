import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensagem } from './entities/mensagem.entity';

@Injectable()
export class MensagensService {
  constructor(@InjectRepository(Mensagem) private repo: Repository<Mensagem>) {}

  async criar(dados: { nome: string; email: string; assunto?: string; mensagem: string; tipo?: string }) {
    const m = this.repo.create(dados);
    return this.repo.save(m);
  }

  async findAll(tipo?: string) {
    const qb = this.repo.createQueryBuilder('m').orderBy('m.criadoEm', 'DESC');
    if (tipo) qb.where('m.tipo = :tipo', { tipo });
    return qb.getMany();
  }
}
