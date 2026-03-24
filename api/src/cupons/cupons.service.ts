import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cupom } from './entities/cupom.entity';

@Injectable()
export class CuponsService {
  constructor(@InjectRepository(Cupom) private repo: Repository<Cupom>) {}

  async validar(codigo: string, total: number) {
    const cupom = await this.repo.findOne({ where: { codigo: codigo.toUpperCase(), ativo: true } });
    if (!cupom) return null;
    if (cupom.minimoCompra && total < Number(cupom.minimoCompra)) return null;
    if (cupom.usos >= cupom.usosMax) return null;
    const hoje = new Date().toISOString().slice(0, 10);
    if (cupom.validoAte && cupom.validoAte < hoje) return null;
    let desconto = 0;
    if (cupom.tipo === 'percentual') desconto = total * (Number(cupom.valor) / 100);
    else desconto = Math.min(Number(cupom.valor), total);
    return { cupom: cupom.codigo, desconto, tipo: cupom.tipo, valor: cupom.valor };
  }
}
