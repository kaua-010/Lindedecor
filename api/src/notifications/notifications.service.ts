import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const EMAIL = process.env.EMAIL_EMPRESA || 'kauavaes55@gmail.com';
const TEL = process.env.TELEFONE_EMPRESA || '(19) 97108-0410';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter() {
    if (!this.transporter && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
    return this.transporter;
  }

  async novoPedido(pedido: any) {
    const itens = pedido.itens || [];
    const fmt = (v: number) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const html = `
      <h2>Novo Pedido #${pedido.codigo}</h2>
      <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
      <p><strong>Email:</strong> ${pedido.emailCliente}</p>
      <p><strong>Telefone:</strong> ${pedido.telefoneCliente || '-'}</p>
      <p><strong>Total:</strong> ${fmt(pedido.total)}</p>
      <p>Itens: ${itens.map((i: any) => `${i.nome} x${i.qty}`).join(', ')}</p>
    `;
    await this.enviarEmail(EMAIL, `[LineDecor] Novo Pedido ${pedido.codigo}`, html);
    if (pedido.emailCliente) {
      await this.enviarEmail(pedido.emailCliente, `Pedido ${pedido.codigo} confirmado`, `
        <p>Olá ${pedido.nomeCliente}!</p>
        <p>Seu pedido foi recebido. Total: ${fmt(pedido.total)}</p>
        <p>Acompanhe em: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/rastrear?codigo=${pedido.codigo}</p>
      `);
    }
    // WhatsApp: preparado para integração Twilio/API
    if (process.env.TWILIO_SID && pedido.telefoneCliente) {
      // await this.enviarWhatsApp(TEL, `Novo pedido ${pedido.codigo} - ${pedido.nomeCliente}`);
    }
  }

  async pagamentoConfirmado(pedido: any) {
    const itens = pedido.itens || [];
    const fmt = (v: number) => 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const html = `
      <h2>💳 Pagamento Aprovado!</h2>
      <p>Olá ${pedido.nomeCliente}!</p>
      <p><strong>Pedido:</strong> #${pedido.codigo}</p>
      <p><strong>Total:</strong> ${fmt(pedido.total)}</p>
      <p><strong>Itens:</strong></p>
      <ul>
        ${itens.map((i: any) => `<li>${i.nome} x${i.qty} - ${fmt(i.preco * i.qty)}</li>`).join('')}
      </ul>
      <p>Seu pedido será preparado e enviado em breve.</p>
      <p>Acompanhe em: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/rastrear?codigo=${pedido.codigo}</p>
    `;
    
    // Email pro cliente
    if (pedido.emailCliente) {
      await this.enviarEmail(
        pedido.emailCliente,
        `✅ Pagamento Confirmado - Pedido ${pedido.codigo}`,
        html,
      );
    }

    // Email pra empresa
    await this.enviarEmail(
      EMAIL,
      `[LineDecor] Pagamento Confirmado ${pedido.codigo}`,
      html,
    );
  }

  private async enviarEmail(to: string, subject: string, html: string) {
    const t = this.getTransporter();
    if (!t) {
      console.log('[Notifications] SMTP não configurado. Email:', subject);
      return;
    }
    try {
      await t.sendMail({
        from: process.env.SMTP_FROM || 'LineDecor <noreply@linedecor.com>',
        to,
        subject,
        html,
      });
    } catch (e: any) {
      console.error('Erro ao enviar email:', e.message);
    }
  }
}
