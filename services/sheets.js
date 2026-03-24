// Sincronização com Google Sheets - LineDecor
// Requer: npm install googleapis
// Configure GOOGLE_SHEETS_ID e GOOGLE_CREDENTIALS no .env

const config = require('../config');
const { getDB } = require('../database');

let sheetsClient = null;

async function getSheets() {
  if (!config.GOOGLE_SHEETS_ID || !config.GOOGLE_CREDENTIALS) {
    return null;
  }
  if (!sheetsClient) {
    try {
      const { google } = require('googleapis');
      const auth = new google.auth.GoogleAuth({
        credentials: config.GOOGLE_CREDENTIALS,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });
      sheetsClient = google.sheets({ version: 'v4', auth });
    } catch (err) {
      console.warn('Google Sheets não configurado:', err.message);
      return null;
    }
  }
  return sheetsClient;
}

function fmt(v) {
  return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
}

async function syncPedidos() {
  const sheets = await getSheets();
  if (!sheets) return { ok: false, msg: 'Google Sheets não configurado' };

  const db = getDB();
  const pedidos = db.prepare(`
    SELECT id, codigo, nome, email, telefone, total, status, codigo_rastreio, criado_em
    FROM pedidos ORDER BY id DESC
  `).all();

  const values = [
    ['ID', 'Código', 'Cliente', 'Email', 'Telefone', 'Total', 'Status', 'Rastreio', 'Data'],
    ...pedidos.map(p => [
      p.id,
      p.codigo || '',
      p.nome,
      p.email || '',
      p.telefone || '',
      fmt(p.total),
      p.status,
      p.codigo_rastreio || '',
      new Date(p.criado_em).toLocaleDateString('pt-BR'),
    ]),
  ];

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.GOOGLE_SHEETS_ID,
      range: 'Pedidos!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    return { ok: true, count: pedidos.length };
  } catch (err) {
    console.error('Erro ao sincronizar pedidos:', err.message);
    return { ok: false, msg: err.message };
  }
}

async function syncProdutos() {
  const sheets = await getSheets();
  if (!sheets) return { ok: false, msg: 'Google Sheets não configurado' };

  const db = getDB();
  const produtos = db.prepare('SELECT * FROM produtos ORDER BY id').all();

  const values = [
    ['ID', 'Nome', 'Categoria', 'Preço', 'Estoque', 'Vendas', 'Badge', 'Coleção'],
    ...produtos.map(p => [
      p.id,
      p.nome,
      p.categoria,
      fmt(p.preco),
      p.estoque,
      p.vendas,
      p.badge || '',
      p.colecao || '',
    ]),
  ];

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.GOOGLE_SHEETS_ID,
      range: 'Produtos!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    return { ok: true, count: produtos.length };
  } catch (err) {
    return { ok: false, msg: err.message };
  }
}

async function syncNewsletter() {
  const sheets = await getSheets();
  if (!sheets) return { ok: false, msg: 'Google Sheets não configurado' };

  const db = getDB();
  const list = db.prepare('SELECT * FROM newsletter ORDER BY id').all();

  const values = [
    ['ID', 'Email', 'Nome', 'Data'],
    ...list.map(n => [n.id, n.email, n.nome || '', new Date(n.criado_em).toLocaleDateString('pt-BR')]),
  ];

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: config.GOOGLE_SHEETS_ID,
      range: 'Newsletter!A1',
      valueInputOption: 'RAW',
      requestBody: { values },
    });
    return { ok: true, count: list.length };
  } catch (err) {
    return { ok: false, msg: err.message };
  }
}

async function syncAll() {
  const [p1, p2, p3] = await Promise.all([syncPedidos(), syncProdutos(), syncNewsletter()]);
  return { pedidos: p1, produtos: p2, newsletter: p3 };
}

module.exports = {
  syncPedidos,
  syncProdutos,
  syncNewsletter,
  syncAll,
};
