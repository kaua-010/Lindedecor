import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Produto } from './entities/produto.entity';

@Injectable()
export class ProdutosService {
  constructor(@InjectRepository(Produto) private repo: Repository<Produto>) {}

  async findAll(filtros?: { categoria?: string; busca?: string; colecao?: string; ordenar?: string }) {
    const qb = this.repo.createQueryBuilder('p');
    if (filtros?.categoria && filtros.categoria !== 'todos') {
      qb.andWhere('p.categoria = :cat', { cat: filtros.categoria });
    }
    if (filtros?.colecao === 'Premium') {
      qb.andWhere('(p.colecao = :col OR p.categoria = :col)', { col: 'Premium' });
    }
    if (filtros?.colecao === 'Kits') {
      qb.andWhere('p.kitCombo = true');
    }
    if (filtros?.busca) {
      qb.andWhere('(p.nome ILIKE :busca OR p.descricao ILIKE :busca)', { busca: `%${filtros.busca}%` });
    }
    switch (filtros?.ordenar) {
      case 'preco_asc': qb.orderBy('p.preco', 'ASC'); break;
      case 'preco_desc': qb.orderBy('p.preco', 'DESC'); break;
      case 'novidades': qb.orderBy('p.criadoEm', 'DESC'); break;
      default: qb.orderBy('p.vendas', 'DESC');
    }
    return qb.getMany();
  }

  async findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async getCategorias() {
    return this.repo.createQueryBuilder('p').select('p.categoria').addSelect('COUNT(*)', 'total').groupBy('p.categoria').getRawMany();
  }
}
