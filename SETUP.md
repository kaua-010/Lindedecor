# 🚀 LineDecor - Guia de Setup e Deployment

Seu e-commerce está **100% pronto para rodar**. Siga este guia em **4 etapas simples**.

---

## 📋 CHECKLIST RÁPIDO

- [ ] PostgreSQL instalado
- [ ] Backend rodando
- [ ] Frontend rodando
- [ ] Stripe configurado
- [ ] Email SMTP funcional
- [ ] Fazer um teste de compra completo

---

## ⚙️ ETAPA 1 — INSTALAR E CONFIGURAR POSTGRESQL

### Windows / Mac / Linux

**Opção 1: Download (Recomendado)**
1. Baixe em: https://www.postgresql.org/download/
2. Instale com password `postgres` (você escolhe)
3. Deixe tudo default (porta 5432)

**Opção 2: Docker (Mais fácil)**
```bash
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
docker exec postgres psql -U postgres -c "CREATE DATABASE linedecor;"
```

### Verificar se está rodando
```bash
psql -U postgres -d linedecor
```
Se abrir o prompt `linedecor=#`, está pronto!

---

## 📦 ETAPA 2 — INSTALAR DEPENDÊNCIAS

### Backend (API)
```bash
cd api
npm install
```

### Frontend (Web)
```bash
cd ../web
npm install
```

---

## 🔑 ETAPA 3 — CONFIGURAR VARIÁVEIS DE AMBIENTE

### Backend `.env` (já criado!)
Arquivo: `/linedecor/.env`

Verifique/edite:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=linedecor

STRIPE_SECRET_KEY=sk_test_XXXXX
STRIPE_PUBLIC_KEY=pk_test_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX

SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

### Frontend `.env.local` (já criado!)
Arquivo: `/web/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_XXXXX
```

---

## 🔌 ETAPA 4 — CONFIGURAR STRIPE (CRÍTICO!)

### Opção A: Stripe Teste
1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie sua **Secret Key** (sk_test_...)
3. Copie sua **Publishable Key** (pk_test_...)
4. Cole no `.env`

### Opção B: Webhook (Para testes locais)
1. Instale Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward: `stripe listen --forward-to localhost:4000/api/payment/webhook`
4. Copie o **Webhook Secret** (whsec_...) para `.env`

---

## ✅ ETAPA 5 — RODAR LOCALMENTE

### Terminal 1 — Backend
```bash
cd api
npm run start:dev
```

Você deve ver:
```
✅ API LineDecor rodando na porta 4000
```

### Terminal 2 — Frontend
```bash
cd ../web
npm run dev
```

Você deve ver:
```
> http://localhost:3000
```

### Abra no browser
```
http://localhost:3000
```

---

## 🧪 TESTAR FLUXO DE COMPRA

1. **Vá para home** → http://localhost:3000
2. **Clique em "Explorar Coleção"**
3. **Adicione 2-3 produtos ao carrinho**
4. **Clique no carrinho → "Finalizar Pedido"**
5. **Preencha os dados:**
   - Nome: `Teste User`
   - Email: `seu_email@gmail.com`
   - Telefone: `(19) 97108-0410`
   - Endereço: `Rua Teste, 123`

6. **Clique em "Confirmar Pedido"**
   - Você será redirecionado para Stripe
   
7. **Use cartão de teste do Stripe:**
   - **Número:** `4242 4242 4242 4242`
   - **Data:** `12/25`
   - **CVC:** `123`

8. **Clique em "Pay"** (ou "Pagar")

9. **Você verá a página de sucesso** ✅

---

## 📧 CONFIGURAR EMAIL (OPCIONAL, MAS IMPORTANTE)

### Gmail
1. Acesse: https://myaccount.google.com/apppasswords
2. Crie uma "Senha de app"
3. Cole em `SMTP_PASS` no `.env`

### Ao fazer um pedido, você receberá:
- ✅ Email de confirmação do pedido
- ✅ Email de pagamento aprovado

---

## 🚀 DEPLOY (LEVAR PRO AR)

### Frontend → Vercel
```bash
cd web
npm run build
```

1. Commit no GitHub
2. Acesse https://vercel.com
3. "Import Project"
4. Selecione seu repo
5. Deploy automático!

### Backend → Railway
1. Acesse https://railway.app
2. "New Project" → "Deploy from GitHub"
3. Selecione seu repo do backend
4. Adicione PostgreSQL com "Add Plugin"
5. Configure variáveis (STRIPE_SECRET_KEY, etc)
6. Deploy automático!

---

## 🐛 TROUBLESHOOTING

### "Erro: PostgreSQL não conecta"
```bash
# Verificar se está rodando
sudo systemctl status postgresql

# Ou via Docker
docker ps | grep postgres
```

### "Erro 500 no Stripe"
- [ ] Secret Key está correta?
- [ ] Webhook Secret está configurado?
- [ ] Stripe CLI está rodando (para teste local)?

### "Frontend não conecta backend"
- [ ] `NEXT_PUBLIC_API_URL` está correto?
- [ ] Backend está rodando na porta 4000?
- [ ] CORS ativado em main.ts?

---

## 📞 COMANDOS ÚTEIS

```bash
# Resetar banco (DELETE DADOS!)
npm run typeorm migration:revert

# Ver logs do Stripe
stripe logs tail --filter-service payment_method

# Limpar cache Next.js
rm -rf web/.next
npm run build

# Kill processo na porta
lsof -i :4000
```

---

## 📊 ARQUITETURA

```
lindedecor/
├── api/                 ← Backend NestJS
│   ├── src/
│   │   ├── payment/    ← Integração Stripe (✨ NOVO)
│   │   ├── pedidos/    ← Módulo de pedidos
│   │   ├── users/      ← Módulo de usuários
│   │   ├── produtos/   ← Catálogo
│   │   └── notifications/ ← Email automático
│   └── package.json
│
├── web/                ← Frontend Next.js
│   ├── app/
│   │   ├── page.tsx    ← Home
│   │   ├── checkout/   ← Checkout (✨ INTEGRADO)
│   │   ├── success/    ← Sucesso (✨ NOVO)
│   │   ├── cancel/     ← Cancelado (✨ NOVO)
│   │   └── ...
│   └── package.json
│
└── .env                ← Variáveis (✨ NOVO)
```

---

## 🎯 PRÓXIMOS PASSOS (OPCIONAL)

- [ ] Integração WhatsApp (Twilio)
- [ ] Google Sheets sync automático
- [ ] App Mobile (React Native)
- [ ] Dashboard admin
- [ ] Sistema de cupons
- [ ] Avaliações com estrelas

---

**Pronto? Comece a rodar!** 🚀

```bash
# Terminal 1
cd api && npm run start:dev

# Terminal 2  
cd ../web && npm run dev
```

Acesse: http://localhost:3000

Qualquer dúvida, cheque o arquivo de logs ou entre em contato! 💪
