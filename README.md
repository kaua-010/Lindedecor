# 🏺 LineDecor — E-commerce Completo

Loja de decoração com Node.js, Express, SQLite, integração com e-mail e Google Sheets.

---

## 📁 Estrutura

```
linedecor/
├── server.js           # API REST + rotas
├── database.js         # SQLite (tabelas + seed)
├── config.js           # Variáveis de ambiente
├── package.json
├── .env.example        # Copie para .env
├── services/
│   ├── email.js        # Notificações por e-mail
│   └── sheets.js       # Sincronização Google Sheets
└── public/
    ├── index.html      # Loja principal
    ├── admin.html      # Painel administrativo
    ├── rastrear.html   # Rastreamento de pedidos
    ├── contato.html    # Formulário de contato
    ├── sobre.html      # Sobre a empresa
    ├── blog.html       # Blog
    ├── central-ajuda.html
    ├── privacidade.html
    ├── trocas-devolucoes.html
    ├── trabalhe-conosco.html
    ├── parceiros.html
    ├── sustentabilidade.html
    ├── style.css
    └── app.js
```

---

## 🚀 Como Rodar

### 1. Instalar dependências
```bash
cd linedecor
npm install
```

### 2. Configurar e-mail (opcional)
Copie `.env.example` para `.env` e preencha:

```env
EMAIL_EMPRESA=contato@suaempresa.com.br
TELEFONE_EMPRESA=(11) 99999-9999
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=senha_de_app_16_caracteres
```

> **Gmail:** Crie uma "Senha de app" em [conta.google.com](https://conta.google.com) → Segurança → Senhas de app.

### 3. Iniciar o servidor
```bash
npm start
```

### 4. Acessar
- **Loja:** http://localhost:3000/index.html
- **Admin:** http://localhost:3000/admin.html
- **Rastrear:** http://localhost:3000/rastrear.html

---

## ✨ Funcionalidades

### Loja
- ✅ Carrinho com persistência (localStorage)
- ✅ Checkout com telefone, CEP, cupom de desconto
- ✅ Frete grátis acima de R$ 299
- ✅ Coleção Premium e Kits
- ✅ Busca, filtros e ordenação
- ✅ Newsletter
- ✅ Layout responsivo (PC, tablet, celular)
- ✅ Links para Instagram Lives

### Admin
- ✅ Dashboard com KPIs
- ✅ CRUD de produtos
- ✅ Gestão de pedidos (status, código de rastreio)
- ✅ Central de mensagens (contato, feedback)
- ✅ Configurações (e-mail, telefone, Instagram)
- ✅ Sincronização com Google Sheets

### E-mail
- ✅ Novo pedido → notificação para o e-mail da empresa
- ✅ Confirmação de pedido → e-mail para o cliente

### Google Sheets
- Configure `GOOGLE_SHEETS_ID` no `.env`
- Crie uma planilha com abas: **Pedidos**, **Produtos**, **Newsletter**
- No Admin → Configurações → "Sincronizar com Google Sheets"

---

## 🗃️ Banco de Dados (SQLite)

| Tabela      | Descrição                    |
|-------------|------------------------------|
| produtos    | Catálogo                     |
| pedidos     | Vendas (com rastreio, cupom) |
| cupons      | Descontos                    |
| newsletter  | E-mails cadastrados          |
| mensagens   | Contato e feedback           |
| comentarios | Avaliações de produtos       |
| config      | Configurações da empresa     |
| blog        | Posts do blog                |

---

## 📋 Cupons de Exemplo

| Código      | Tipo      | Valor | Mínimo  |
|-------------|-----------|-------|---------|
| BEMVINDO10  | Percentual| 10%   | R$ 100  |
| FRETE299    | Fixo      | R$ 25 | R$ 299  |

---

## 📱 Contato e Notificações

- **Pedidos:** Enviados para o e-mail configurado em `EMAIL_EMPRESA`
- **Telefone:** Configure em Admin → Configurações (aparece no site como WhatsApp)
- **SMS:** Estrutura pronta para Twilio (configure no `.env`)

---

*LineDecor — Decoração que transforma espaços.*
