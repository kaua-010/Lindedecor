import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { NotificationsService } from '../notifications/notifications.service';

function gerarCodigo() {
  return 'LD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

@Injectable()
export class PedidosService {
  constructor(
    @InjectRepository(Pedido) private repo: Repository<Pedido>,
    private notif: NotificationsService,
  ) {}

  async criar(dados: any) {
    const pedido = this.repo.create({
      codigo: gerarCodigo(),
      itens: dados.itens,
      subtotal: dados.subtotal,
      frete: dados.frete ?? 0,
      desconto: dados.desconto ?? 0,
      cupom: dados.cupom,
      total: dados.total,
      nomeCliente: dados.nome,
      emailCliente: dados.email,
      telefoneCliente: dados.telefone,
      enderecoEntrega: dados.endereco,
      notas: dados.notas,
      userId: dados.userId ?? null,
    } as any);
    const saved = await this.repo.save(pedido);
    await this.notif.novoPedido(saved);
    return saved;
  }

  async findAll() {
    return this.repo.find({ order: { criadoEm: 'DESC' } });
  }

  async rastrear(codigo: string) {
    return this.repo.findOne({ where: [{ codigo }, { id: codigo }] });
  }

  async atualizarStatus(id: string, status: string, rastreio?: string, transportadora?: string) {
    await this.repo.update(id, { status, codigoRastreio: rastreio, transportadora });
    return this.repo.findOne({ where: { id } });
  }
}
