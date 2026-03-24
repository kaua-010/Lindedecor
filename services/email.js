// Serviço de envio de emails - LineDecor

const nodemailer = require('nodemailer');
const config = require('../config');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    if (!config.SMTP_USER || !config.SMTP_PASS) {
      console.warn('⚠ SMTP não configurado. Emails não serão enviados.');
      return null;
    }
    transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_PORT === 465,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      },
    });
  }
  return transporter;
}

function fmt(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

async function enviarEmailPedido(pedido) {
  const transport = getTransporter();
  if (!transport) return { ok: false, msg: 'SMTP não configurado' };

  const itens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens;
  const itensHtml = itens.map(i => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.emoji || '📦'} ${i.nome}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.preco * i.qty)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1C1410">🛍️ Novo Pedido LineDecor #${pedido.id}</h2>
      <p><strong>Cliente:</strong> ${pedido.nome}</p>
      <p><strong>Email:</strong> ${pedido.email || '-'}</p>
      <p><strong>Telefone:</strong> ${pedido.telefone || '-'}</p>
      <p><strong>Endereço:</strong><br>${(pedido.endereco || '-').replace(/\n/g, '<br>')}</p>
      ${pedido.cep ? `<p><strong>CEP:</strong> ${pedido.cep}</p>` : ''}
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <thead>
          <tr style="background:#f5f0e8">
            <th style="padding:10px;text-align:left">Produto</th>
            <th style="padding:10px">Qtd</th>
            <th style="padding:10px;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>${itensHtml}</tbody>
      </table>
      <p><strong>Subtotal:</strong> ${fmt(pedido.subtotal || pedido.total)}</p>
      ${pedido.desconto ? `<p><strong>Desconto:</strong> -${fmt(pedido.desconto)} ${pedido.cupom ? `(${pedido.cupom})` : ''}</p>` : ''}
      ${pedido.frete ? `<p><strong>Frete:</strong> ${fmt(pedido.frete)}</p>` : ''}
      <h3 style="color:#C9A84C">Total: ${fmt(pedido.total)}</h3>
      <p style="font-size:12px;color:#888">Recebido em ${new Date().toLocaleString('pt-BR')}</p>
    </div>
  `;

  try {
    await transport.sendMail({
      from: config.SMTP_FROM,
      to: config.EMAIL_EMPRESA,
      subject: `[LineDecor] Novo Pedido #${pedido.id} - ${pedido.nome} - ${fmt(pedido.total)}`,
      html,
      text: `Novo pedido #${pedido.id} de ${pedido.nome}. Total: ${fmt(pedido.total)}`,
    });
    return { ok: true };
  } catch (err) {
    console.error('Erro ao enviar email:', err.message);
    return { ok: false, msg: err.message };
  }
}

async function enviarConfirmacaoCliente(pedido) {
  const transport = getTransporter();
  if (!transport || !pedido.email) return { ok: false };

  const itens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens;
  const itensHtml = itens.map(i => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee">${i.emoji || '📦'} ${i.nome} × ${i.qty}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${fmt(i.preco * i.qty)}</td>
    </tr>
  `).join('');

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <h2 style="color:#1C1410">Obrigado pela sua compra! 🎉</h2>
      <p>Olá, <strong>${pedido.nome}</strong>!</p>
      <p>Seu pedido <strong>#${pedido.id}</strong> foi recebido com sucesso.</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0">
        <tbody>${itensHtml}</tbody>
      </table>
      <h3 style="color:#C9A84C">Total: ${fmt(pedido.total)}</h3>
      <p>Acompanhe o status em: <a href="${config.SITE_URL || 'http://localhost:3000'}/rastrear.html?codigo=${pedido.codigo || pedido.id}">Rastrear Pedido</a></p>
      <p style="font-size:12px;color:#888">LineDecor - Decoração que transforma espaços</p>
    </div>
  `;

  try {
    await transport.sendMail({
      from: config.SMTP_FROM,
      to: pedido.email,
      subject: `Pedido #${pedido.id} confirmado - LineDecor`,
      html,
    });
    return { ok: true };
  } catch (err) {
    console.error('Erro ao enviar confirmação:', err.message);
    return { ok: false };
  }
}

module.exports = {
  enviarEmailPedido,
  enviarConfirmacaoCliente,
};
