// LineDecor - Configuração
// Crie um arquivo .env na raiz com suas variáveis (veja .env.example)

require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  
  // Email da empresa (recebe notificações de pedidos)
  EMAIL_EMPRESA: process.env.EMAIL_EMPRESA || 'contato@linedecor.com.br',
  TELEFONE_EMPRESA: process.env.TELEFONE_EMPRESA || '(11) 99999-9999',
  
  // SMTP para envio de emails (Gmail, Outlook, etc)
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'LineDecor <noreply@linedecor.com.br>',
  
  // SMS (Twilio) - opcional
  TWILIO_SID: process.env.TWILIO_SID || '',
  TWILIO_TOKEN: process.env.TWILIO_TOKEN || '',
  TWILIO_PHONE: process.env.TWILIO_PHONE || '',
  
  // Google Sheets - ID da planilha para sincronizar
  GOOGLE_SHEETS_ID: process.env.GOOGLE_SHEETS_ID || '',
  GOOGLE_CREDENTIALS: process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null,
  
  // Frete grátis acima de (R$)
  FRETE_GRATIS_MINIMO: parseFloat(process.env.FRETE_GRATIS_MINIMO || '299'),
  
  // URL base do site (para emails)
  SITE_URL: process.env.SITE_URL || 'http://localhost:3000',
};
