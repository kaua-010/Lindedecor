# Como fazer o LineDecor funcionar

## 1. Instalar Node.js

1. Acesse: **https://nodejs.org**
2. Baixe a versão **LTS**
3. Instale (marque a opção "Add to PATH")
4. **Feche e reabra o terminal/CMD** após instalar

## 2. Verificar instalação

Abra um novo terminal (CMD ou PowerShell) e digite:

```
node -v
npm -v
```

Se aparecer um número de versão (ex: v20.10.0), está instalado.

## 3. Iniciar o sistema

**Opção A – Duplo clique:**  
Dê duplo clique no arquivo `INICIAR.bat` na pasta do projeto.

**Opção B – Terminal:**
```bash
cd "d:\LINEDECOR\linedecor TESTE 1\linedecor"
npm install
npm start
```

## 4. Acessar

- **Loja:** http://localhost:3000/index.html  
- **Admin:** http://localhost:3000/admin.html  

## Se der erro

| Erro | Solução |
|------|---------|
| "node não é reconhecido" | Instale o Node.js e reinicie o terminal |
| "npm install falhou" | Verifique sua conexão com a internet |
| "EADDRINUSE" (porta em uso) | Feche outro programa que use a porta 3000 |
| Página em branco | Acesse http://localhost:3000/index.html (não apenas localhost:3000) |
