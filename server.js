const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB, getDB } = require('./database');
const config = require('./config');
const { enviarEmailPedido, enviarConfirmacaoCliente } = require('./services/email');
const sheets = require('./services/sheets');

const app = express();
const PORT = config.PORT;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function gerarCodigoPedido() {
  return 'LD' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// ── PRODUTOS ──────────────────────────────────────────
app.get('/api/produtos', (req, res) => {
  const db = getDB();
  const { categoria, busca, ordenar, colecao } = req.query;
  let sql = 'SELECT * FROM produtos WHERE 1=1';
  const params = [];

  if (categoria && categoria !== 'todos') {
    sql += ' AND categoria = ?';
    params.push(categoria);
  }
  if (colecao === 'Premium') {
    sql += ' AND (colecao = ? OR categoria = ?)';
    params.push('Premium', 'Premium');
  }
  if (colecao === 'Kits') {
    sql += ' AND kit_combo = 1';
  }
  if (busca) {
    sql += ' AND (nome LIKE ? OR descricao LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`);
  }
  if (ordenar === 'preco_asc') sql += ' ORDER BY preco ASC';
  else if (ordenar === 'preco_desc') sql += ' ORDER BY preco DESC';
  else if (ordenar === 'novidades') sql += ' ORDER BY criado_em DESC';
  else sql += ' ORDER BY vendas DESC';

  const produtos = db.prepare(sql).all(...params);
  res.json(produtos);
});

app.get('/api/produtos/:id', (req, res) => {
  const db = getDB();
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ?').get(req.params.id);
  if (!produto) return res.status(404).json({ erro: 'Produto não encontrado' });
  res.json(produto);
});

app.post('/api/produtos', (req, res) => {
  const db = getDB();
  const { nome, descricao, preco, preco_original, categoria, emoji, estoque, badge, colecao } = req.body;
  if (!nome || !preco || !categoria) return res.status(400).json({ erro: 'Dados inválidos' });
  const result = db.prepare(
    'INSERT INTO produtos (nome, descricao, preco, preco_original, categoria, emoji, estoque, badge, colecao) VALUES (?,?,?,?,?,?,?,?,?)'
  ).run(nome, descricao, preco, preco_original || null, categoria, emoji || '✨', estoque || 10, badge || null, colecao || null);
  res.status(201).json({ id: result.lastInsertRowid, mensagem: 'Produto criado!' });
});

app.put('/api/produtos/:id', (req, res) => {
  const db = getDB();
  const { nome, descricao, preco, preco_original, categoria, emoji, estoque, badge, colecao } = req.body;
  db.prepare(
    'UPDATE produtos SET nome=?, descricao=?, preco=?, preco_original=?, categoria=?, emoji=?, estoque=?, badge=?, colecao=? WHERE id=?'
  ).run(nome, descricao, preco, preco_original || null, categoria, emoji, estoque, badge || null, colecao || null, req.params.id);
  res.json({ mensagem: 'Produto atualizado!' });
});

app.delete('/api/produtos/:id', (req, res) => {
  const db = getDB();
  db.prepare('DELETE FROM produtos WHERE id = ?').run(req.params.id);
  res.json({ mensagem: 'Produto removido!' });
});

// ── CUPONS ────────────────────────────────────────────
app.get('/api/cupons/validar', (req, res) => {
  const db = getDB();
  const { codigo, total } = req.query;
  if (!codigo || !total) return res.status(400).json({ erro: 'Código e total obrigatórios' });
  const cupom = db.prepare('SELECT * FROM cupons WHERE codigo = ? AND ativo = 1').get(codigo.toUpperCase());
  if (!cupom) return res.status(404).json({ erro: 'Cupom inválido ou expirado' });
  const totalNum = parseFloat(total);
  if (cupom.minimo_compra && totalNum < cupom.minimo_compra) {
    return res.status(400).json({ erro: `Compra mínima de R$ ${cupom.minimo_compra} para este cupom` });
  }
  if (cupom.usos >= cupom.usos_max) return res.status(400).json({ erro: 'Cupom esgotado' });
  const hoje = new Date().toISOString().slice(0, 10);
  if (cupom.valido_ate && cupom.valido_ate < hoje) return res.status(400).json({ erro: 'Cupom expirado' });
  if (cupom.valido_de && cupom.valido_de > hoje) return res.status(400).json({ erro: 'Cupom ainda não válido' });

  let desconto = 0;
  if (cupom.tipo === 'percentual') desconto = totalNum * (cupom.valor / 100);
  else desconto = Math.min(cupom.valor, totalNum);
  res.json({ cupom: cupom.codigo, desconto, tipo: cupom.tipo, valor: cupom.valor });
});

// ── PEDIDOS ───────────────────────────────────────────
app.get('/api/pedidos', (req, res) => {
  const db = getDB();
  const pedidos = db.prepare('SELECT * FROM pedidos ORDER BY criado_em DESC').all();
  const result = pedidos.map(p => ({
    ...p,
    itens: typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens
  }));
  res.json(result);
});

app.get('/api/pedidos/rastrear/:codigo', (req, res) => {
  const db = getDB();
  const pedido = db.prepare('SELECT * FROM pedidos WHERE codigo = ? OR id = ?').get(req.params.codigo, req.params.codigo);
  if (!pedido) return res.status(404).json({ erro: 'Pedido não encontrado' });
  pedido.itens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens;
  res.json(pedido);
});

app.post('/api/pedidos', async (req, res) => {
  const db = getDB();
  const { nome, email, telefone, itens, total, subtotal, frete, desconto, cupom, endereco, cidade, estado, cep, notas } = req.body;
  if (!nome || !itens || !total) return res.status(400).json({ erro: 'Dados inválidos' });

  const codigo = gerarCodigoPedido();
  const subtotalVal = subtotal ?? total;
  const freteVal = frete ?? 0;
  const descontoVal = desconto ?? 0;

  itens.forEach(item => {
    db.prepare('UPDATE produtos SET estoque = estoque - ?, vendas = vendas + ? WHERE id = ?')
      .run(item.qty, item.qty, item.id);
  });

  const result = db.prepare(`
    INSERT INTO pedidos (codigo, nome, email, telefone, itens, subtotal, frete, desconto, cupom, total, endereco, cidade, estado, cep, notas, status)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `).run(codigo, nome, email || '', telefone || '', JSON.stringify(itens), subtotalVal, freteVal, descontoVal, cupom || null, total, endereco || '', cidade || '', estado || '', cep || '', notas || '', 'pendente');

  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(result.lastInsertRowid);
  pedido.itens = typeof pedido.itens === 'string' ? JSON.parse(pedido.itens) : pedido.itens;

  // Enviar email para empresa e cliente
  try {
    const r1 = await enviarEmailPedido(pedido);
    if (r1.ok) console.log('📧 Email enviado para empresa');
    const r2 = await enviarConfirmacaoCliente(pedido);
    if (r2.ok) console.log('📧 Confirmação enviada ao cliente');
  } catch (e) {
    console.warn('Email:', e.message);
  }

  res.status(201).json({
    id: result.lastInsertRowid,
    codigo,
    mensagem: 'Pedido realizado com sucesso! Você receberá a confirmação por email.'
  });
});

app.put('/api/pedidos/:id/status', (req, res) => {
  const db = getDB();
  const { status, codigo_rastreio, transportadora } = req.body;
  db.prepare('UPDATE pedidos SET status = ?, codigo_rastreio = COALESCE(?, codigo_rastreio), transportadora = COALESCE(?, transportadora), atualizado_em = CURRENT_TIMESTAMP WHERE id = ?')
    .run(status, codigo_rastreio || null, transportadora || null, req.params.id);
  res.json({ mensagem: 'Status atualizado!' });
});

app.put('/api/pedidos/:id/rastreio', (req, res) => {
  const db = getDB();
  const { codigo_rastreio, transportadora } = req.body;
  db.prepare('UPDATE pedidos SET codigo_rastreio = ?, transportadora = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?')
    .run(codigo_rastreio || '', transportadora || '', req.params.id);
  res.json({ mensagem: 'Rastreio atualizado!' });
});

// ── CATEGORIAS ────────────────────────────────────────
app.get('/api/categorias', (req, res) => {
  const db = getDB();
  const cats = db.prepare('SELECT DISTINCT categoria, COUNT(*) as total FROM produtos GROUP BY categoria').all();
  res.json(cats);
});

// ── MENSAGENS / CONTATO ───────────────────────────────
app.post('/api/mensagens', (req, res) => {
  const db = getDB();
  const { nome, email, assunto, mensagem, tipo } = req.body;
  if (!nome || !email || !mensagem) return res.status(400).json({ erro: 'Nome, email e mensagem são obrigatórios' });
  db.prepare('INSERT INTO mensagens (nome, email, assunto, mensagem, tipo) VALUES (?,?,?,?,?)')
    .run(nome, email, assunto || '', mensagem, tipo || 'contato');
  res.status(201).json({ mensagem: 'Mensagem enviada com sucesso!' });
});

app.get('/api/mensagens', (req, res) => {
  const db = getDB();
  const { tipo } = req.query;
  let sql = 'SELECT * FROM mensagens ORDER BY criado_em DESC';
  const params = [];
  if (tipo) { sql += ' WHERE tipo = ?'; params.push(tipo); }
  const list = db.prepare(sql).all(...params);
  res.json(list);
});

// ── COMENTÁRIOS DE PRODUTOS ───────────────────────────
app.get('/api/produtos/:id/comentarios', (req, res) => {
  const db = getDB();
  const list = db.prepare('SELECT * FROM comentarios WHERE produto_id = ? AND aprovado = 1 ORDER BY criado_em DESC').all(req.params.id);
  res.json(list);
});

app.post('/api/comentarios', (req, res) => {
  const db = getDB();
  const { produto_id, nome, email, nota, texto } = req.body;
  if (!produto_id || !nome || !email) return res.status(400).json({ erro: 'Dados obrigatórios' });
  db.prepare('INSERT INTO comentarios (produto_id, nome, email, nota, texto, aprovado) VALUES (?,?,?,?,?,0)')
    .run(produto_id, nome, email, Math.min(5, Math.max(1, parseInt(nota) || 5)), texto || '');
  res.status(201).json({ mensagem: 'Comentário enviado! Será publicado após aprovação.' });
});

// ── CONFIG ─────────────────────────────────────────────
app.get('/api/config', (req, res) => {
  const db = getDB();
  const rows = db.prepare('SELECT chave, valor FROM config').all();
  const obj = {};
  rows.forEach(r => { obj[r.chave] = r.valor; });
  res.json(obj);
});

app.put('/api/config', (req, res) => {
  const db = getDB();
  const { chave, valor } = req.body;
  if (!chave) return res.status(400).json({ erro: 'Chave obrigatória' });
  db.prepare('INSERT OR REPLACE INTO config (chave, valor, atualizado_em) VALUES (?, ?, CURRENT_TIMESTAMP)').run(chave, valor || '');
  res.json({ mensagem: 'Config atualizada!' });
});

// ── BLOG ───────────────────────────────────────────────
app.get('/api/blog', (req, res) => {
  const db = getDB();
  const list = db.prepare('SELECT id, titulo, slug, resumo, imagem, criado_em FROM blog WHERE publicado = 1 ORDER BY criado_em DESC').all();
  res.json(list);
});

// ── DASHBOARD ─────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const db = getDB();
  const totalProdutos = db.prepare('SELECT COUNT(*) as total FROM produtos').get().total;
  const totalPedidos  = db.prepare('SELECT COUNT(*) as total FROM pedidos').get().total;
  const receitaTotal  = db.prepare('SELECT COALESCE(SUM(total),0) as total FROM pedidos WHERE status != "cancelado"').get().total;
  const estoqueBaixo  = db.prepare('SELECT COUNT(*) as total FROM produtos WHERE estoque < 5').get().total;
  const mensagensNaoLidas = db.prepare('SELECT COUNT(*) as total FROM mensagens WHERE lida = 0').get().total;
  const pedidosRecentes = db.prepare('SELECT * FROM pedidos ORDER BY criado_em DESC LIMIT 5').all()
    .map(p => ({ ...p, itens: typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens }));
  const maisVendidos = db.prepare('SELECT nome, vendas, emoji FROM produtos ORDER BY vendas DESC LIMIT 5').all();
  res.json({ totalProdutos, totalPedidos, receitaTotal, estoqueBaixo, mensagensNaoLidas, pedidosRecentes, maisVendidos });
});

// ── NEWSLETTER ────────────────────────────────────────
app.post('/api/newsletter', (req, res) => {
  const db = getDB();
  const { email, nome } = req.body;
  if (!email) return res.status(400).json({ erro: 'E-mail obrigatório' });
  try {
    db.prepare('INSERT INTO newsletter (email, nome) VALUES (?,?)').run(email, nome || '');
    res.json({ mensagem: 'Cadastrado com sucesso!' });
  } catch {
    res.status(409).json({ erro: 'E-mail já cadastrado' });
  }
});

// ── GOOGLE SHEETS SYNC ────────────────────────────────
app.post('/api/sync/sheets', async (req, res) => {
  try {
    const result = await sheets.syncAll();
    res.json({ mensagem: 'Sincronizado!', ...result });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ── START ─────────────────────────────────────────────
initDB();
app.listen(PORT, () => {
  console.log(`\n✅ LineDecor rodando em http://localhost:${PORT}`);
  console.log(`🛍️  Loja:  http://localhost:${PORT}/index.html`);
  console.log(`⚙️  Admin: http://localhost:${PORT}/admin.html`);
  console.log(`📋 Rastrear: http://localhost:${PORT}/rastrear.html\n`);
});
