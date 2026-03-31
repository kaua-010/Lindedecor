import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Pedido } from '../pedidos/entities/pedido.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Pedido) private pedidoRepo: Repository<Pedido>,
    private notificationsService: NotificationsService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16' as any,
    });
  }

  /** Criar sessão de checkout no Stripe */
  async criarCheckout(pedidoId: string, itens: any[]) {
    const pedido = await this.pedidoRepo.findOne({ where: { id: pedidoId } });
    if (!pedido) throw new Error('Pedido não encontrado');

    const lineItems = itens.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.nome,
          description: item.descricao || '',
        },
        unit_amount: Math.round(item.preco * 100), // Centavos
      },
      quantity: item.qty,
    }));

    // Adicionar taxa de frete se existir
    if (pedido.frete > 0) {
      lineItems.push({
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'Frete',
          },
          unit_amount: Math.round(pedido.frete * 100),
        },
        quantity: 1,
      });
    }

    // Criar sessão
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: pedido.emailCliente,
      metadata: {
        pedidoId: pedido.id,
        codigoPedido: pedido.codigo,
      },
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cancel`,
    });

    // Salvar sessionId no pedido
    await this.pedidoRepo.update(pedidoId, {
      stripeSessionId: session.id,
    });

    return { sessionId: session.id, url: session.url };
  }

  /** Webhook do Stripe - processar pagamento aprovado */
  async processarWebhook(event: any) {
    switch (event.type) {
      // Pagamento concluído
      case 'checkout.session.completed':
        return this.handleCheckoutCompleted(event.data.object);

      // Pagamento falhou
      case 'payment_intent.payment_failed':
        return this.handlePaymentFailed(event.data.object);

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }
  }

  /** Quando checkout for completado */
  private async handleCheckoutCompleted(session: any) {
    const pedidoId = session.metadata.pedidoId;
    const pedido = await this.pedidoRepo.findOne({ where: { id: pedidoId } });

    if (!pedido) {
      console.error(`Pedido ${pedidoId} não encontrado`);
      return;
    }

    // Atualizar status do pedido
    await this.pedidoRepo.update(pedidoId, {
      status: 'pago',
      stripePaymentId: session.payment_intent,
    });

    // Buscar pedido atualizado
    const pedidoAtualizado = await this.pedidoRepo.findOne({
      where: { id: pedidoId },
    });

    // Enviar email de confirmação de pagamento
    if (pedidoAtualizado) {
      await this.notificationsService.pagamentoConfirmado(pedidoAtualizado);
    }

    console.log(`✅ Pagamento confirmado para pedido ${pedido.codigo}`);
  }

  /** Quando pagamento falhar */
  private async handlePaymentFailed(paymentIntent: any) {
    console.error(`❌ Pagamento falhou: ${paymentIntent.id}`);
    // Aqui você pode enviar email de falha, etc
  }

  /** Verificar status da sessão */
  async verificarSessao(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      paymentIntent: session.payment_intent,
    };
  }
}
