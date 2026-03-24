# 🏗️ LineDecor — Nova Arquitetura (Documento do Arquiteto)

## Stack

- **Frontend:** Next.js 14 + Tailwind (deploy: Vercel)
- **Backend:** NestJS + TypeORM (deploy: Railway/AWS)
- **Banco:** PostgreSQL
- **Chat:** Socket.io (WebSocket)

## Estrutura

```
linedecor/
├── web/          # Next.js (porta 3000)
│   ├── app/      # App Router
│   ├── components/
│   └── lib/
├── api/          # NestJS (porta 4000)
│   └── src/
│       ├── auth/
│       ├── users/
│       ├── produtos/
│       ├── pedidos/
│       ├── cupons/
│       ├── mensagens/
│       ├── avaliacoes/
│       ├── newsletter/
│       ├── chat/        # WebSocket
│       ├── notifications/
│       └── sheets/
└── public/       # Legado (HTML estático)
```

## Como Rodar

### 1. PostgreSQL

```bash
# Docker
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=linedecor postgres:15
```

### 2. API (NestJS)

```bash
cd api
npm install
cp .env.example .env
# Editar .env com credenciais
npm run start:dev
```

### 3. Web (Next.js)

```bash
cd web
npm install
# .env.local: NEXT_PUBLIC_API_URL=http://localhost:4000/api
npm run dev
```

### 4. Seed (após primeira execução da API)

```bash
cd api
npx ts-node src/seed.ts
```

## Contatos Configurados

- **Email:** kauavaes55@gmail.com
- **Telefone:** (19) 97108-0410

## Funcionalidades Implementadas

✅ Loja com categorias (Vasos, Velas, Quadros, Premium, Kits)
✅ Carrinho com persistência
✅ Checkout com cupom
✅ Pedidos com rastreio
✅ Email (novo pedido + confirmação cliente)
✅ Auth JWT + bcrypt
✅ Mensagens/Contato
✅ Avaliações de produtos
✅ Newsletter
✅ Chat WebSocket (estrutura)
✅ Páginas institucionais (todas)
✅ Google Sheets (estrutura)

## Deploy

- **Vercel:** conectar pasta `web`, configurar NEXT_PUBLIC_API_URL
- **Railway:** conectar pasta `api`, adicionar PostgreSQL, variáveis de ambiente
