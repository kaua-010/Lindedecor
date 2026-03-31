# ⚡ QUICK START — 5 MINUTOS

**Rodar seu e-commerce AGORA**

---

## 1️⃣ PostgreSQL Rodando?

```bash
# Teste
psql -U postgres -d linedecor
```

Se funcionar, ótimo! Se não:
```bash
# Windows: Download em postgresql.org/download/
# Mac: brew install postgresql
# Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:latest
```

---

## 2️⃣ Instalar Dependencies (3 min)

```bash
cd linedecor

# Backend
cd api && npm install && cd ..

# Frontend
cd web && npm install && cd ..
```

---

## 3️⃣ Configurar Stripe (2 min)

1. Acesse: https://dashboard.stripe.com/test/apikeys
2. Copie as 3 chaves:
   - `sk_test_XXXXX` 
   - `pk_test_XXXXX`
   - `whsec_XXXXX`

3. Abra `/linedecor/.env` e cole:
```env
STRIPE_SECRET_KEY=sk_test_seu_key_aqui
STRIPE_PUBLIC_KEY=pk_test_seu_key_aqui
STRIPE_WEBHOOK_SECRET=whsec_seu_key_aqui
```

4. Abra `/web/.env.local` e cole:
```env
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_seu_key_aqui
```

---

## 4️⃣ Rodar (2 commands)

### Terminal 1 - Backend:
```bash
cd linedecor/api
npm run start:dev
```

Vai aparecer:
```
✅ API LineDecor rodando na porta 4000
```

### Terminal 2 - Frontend:
```bash
cd linedecor/web
npm run dev
```

Vai aparecer:
```
> http://localhost:3000
```

---

## 5️⃣ TESTAR

Abra: http://localhost:3000

1. Adicione produtos ao carrinho
2. Finalize
3. Use cartão: `4242 4242 4242 4242` / `12/25` / `123`
4. Veja a página de sucesso ✅

---

## 🎉 PRONTO!

Seu e-commerce está rodando com:
- ✅ Carrinho
- ✅ Checkout  
- ✅ Pagamento Stripe
- ✅ Email automático
- ✅ Tudo funcionando

---

## ❓ ERROS COMUNS

### "Cannot find module 'stripe'"
```bash
cd api && npm install stripe
```

### "PostgreSQL connection error"
```bash
psql -U postgres -d linedecor -c "SELECT 1"
```

### "Cannot GET /"
- Frontend rodando na porta 3000? ✅
- Backend rodando na porta 4000? ✅

### "Payment failed"
- Stripe keys corretas no `.env`? ✅
- Usar cartão de teste `4242 4242 4242 4242`? ✅

---

## 📖 Precisa de mais?

- **Setup completo:** Veja `SETUP.md`
- **O que foi feito:** Veja `IMPLEMENTADO.md`  
- **Roadmap:** Veja `ROADMAP.md`

---

**Só isso! 🚀**

Qualquer dúvida, os 3 arquivos acima têm tudo que você precisa.
