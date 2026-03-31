import { Controller, Post, Get, Body, Param, RawBodyRequest, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /** POST /api/payment/checkout
   * Cria checkout no Stripe
   * Body: { pedidoId: string, itens: any[] }
   */
  @Post('checkout')
  async criarCheckout(@Body() body: { pedidoId: string; itens: any[] }) {
    return this.paymentService.criarCheckout(body.pedidoId, body.itens);
  }

  /** POST /api/payment/webhook
   * Webhook do Stripe (configurar em Stripe Dashboard)
   */
  @Post('webhook')
  async webhook(
    @RawBodyRequest() req: Request,
    @Body() body: any,
  ) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
    const sig = (req.headers as any)['stripe-signature'];

    try {
      const event = stripe.webhooks.constructEvent(
        (req as any).rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET || '',
      );
      await this.paymentService.processarWebhook(event);
      return { received: true };
    } catch (err: any) {
      console.error('Erro ao processar webhook:', err.message);
      throw err;
    }
  }

  /** GET /api/payment/session/:sessionId
   * Verificar status da sessão
   */
  @Get('session/:sessionId')
  async verificarSessao(@Param('sessionId') sessionId: string) {
    return this.paymentService.verificarSessao(sessionId);
  }
}
