const Database = require('better-sqlite3');
const path = require('path');

let db;

function initDB() {
  db = new Database(path.join(__dirname, 'linedecor.db'));
  db.pragma('journal_mode = WAL');

  db.exec(`
    -- PRODUTOS
    CREATE TABLE IF NOT EXISTS produtos (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      nome         TEXT NOT NULL,
      descricao    TEXT,
      preco        REAL NOT NULL,
      preco_original REAL,
      categoria    TEXT NOT NULL,
      subcategoria TEXT,
      emoji        TEXT DEFAULT '✨',
      imagem       TEXT,
      estoque      INTEGER DEFAULT 10,
      vendas       INTEGER DEFAULT 0,
      badge        TEXT,
      colecao      TEXT,
      kit_combo    INTEGER DEFAULT 0,
      criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- PEDIDOS (com campos para rastreamento, desconto, telefone)
    CREATE TABLE IF NOT EXISTS pedidos (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo       TEXT UNIQUE,
      nome         TEXT NOT NULL,
      email        TEXT,
      telefone     TEXT,
      endereco     TEXT,
      cidade       TEXT,
      estado       TEXT,
      cep          TEXT,
      itens        TEXT NOT NULL,
      subtotal     REAL,
      frete        REAL DEFAULT 0,
      desconto     REAL DEFAULT 0,
      cupom        TEXT,
      total        REAL NOT NULL,
      status       TEXT DEFAULT 'pendente',
      codigo_rastreio TEXT,
      transportadora TEXT,
      notas        TEXT,
      criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP,
      atualizado_em DATETIME
    );

    -- CUPONS / DESCONTOS
    CREATE TABLE IF NOT EXISTS cupons (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo       TEXT UNIQUE NOT NULL,
      tipo         TEXT DEFAULT 'percentual',
      valor        REAL NOT NULL,
      minimo_compra REAL DEFAULT 0,
      usos_max     INTEGER DEFAULT 999,
      usos         INTEGER DEFAULT 0,
      valido_de    DATE,
      valido_ate   DATE,
      ativo        INTEGER DEFAULT 1,
      criado_em    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- NEWSLETTER
    CREATE TABLE IF NOT EXISTS newsletter (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      email     TEXT UNIQUE NOT NULL,
      nome      TEXT,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- MENSAGENS / CONTATO
    CREATE TABLE IF NOT EXISTS mensagens (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nome      TEXT NOT NULL,
      email     TEXT NOT NULL,
      assunto   TEXT,
      mensagem  TEXT NOT NULL,
      tipo      TEXT DEFAULT 'contato',
      lida      INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- COMENTÁRIOS DE PRODUTOS
    CREATE TABLE IF NOT EXISTS comentarios (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      produto_id INTEGER NOT NULL,
      nome      TEXT NOT NULL,
      email     TEXT NOT NULL,
      nota      INTEGER DEFAULT 5,
      texto     TEXT,
      aprovado  INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (produto_id) REFERENCES produtos(id)
    );

    -- CONFIGURAÇÕES (email empresa, telefone, etc)
    CREATE TABLE IF NOT EXISTS config (
      chave     TEXT PRIMARY KEY,
      valor     TEXT,
      atualizado_em DATETIME
    );

    -- BLOG (posts simples)
    CREATE TABLE IF NOT EXISTS blog (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo    TEXT NOT NULL,
      slug      TEXT UNIQUE,
      resumo    TEXT,
      conteudo  TEXT,
      imagem    TEXT,
      publicado INTEGER DEFAULT 0,
      criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- TABELAS AUXILIARES
    CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status);
    CREATE INDEX IF NOT EXISTS idx_pedidos_criado ON pedidos(criado_em);
    CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria);
    CREATE INDEX IF NOT EXISTS idx_produtos_colecao ON produtos(colecao);
    CREATE INDEX IF NOT EXISTS idx_mensagens_tipo ON mensagens(tipo);
  `);

  // Migrar pedidos antigos (adicionar colunas se não existirem)
  const alterCols = ['telefone TEXT', 'codigo_rastreio TEXT', 'cupom TEXT', 'desconto REAL DEFAULT 0',
    'codigo TEXT', 'subtotal REAL', 'frete REAL DEFAULT 0', 'cidade TEXT', 'estado TEXT', 'cep TEXT',
    'transportadora TEXT', 'notas TEXT', 'atualizado_em DATETIME'];
  alterCols.forEach(col => {
    try { db.exec(`ALTER TABLE pedidos ADD COLUMN ${col}`); } catch (_) {}
  });

  // Config padrão
  const configCount = db.prepare('SELECT COUNT(*) as n FROM config').get().n;
  if (configCount === 0) {
    db.prepare(`
      INSERT INTO config (chave, valor) VALUES 
        ('email_empresa', 'contato@linedecor.com.br'),
        ('telefone_empresa', '(11) 99999-9999'),
        ('instagram', 'https://instagram.com/linedecor'),
        ('frete_gratis_minimo', '299'),
        ('google_sheets_id', '')
    `).run();
  }

  // SEED produtos
  const count = db.prepare('SELECT COUNT(*) as n FROM produtos').get().n;
  if (count === 0) {
    const insert = db.prepare(
      'INSERT INTO produtos (nome, descricao, preco, preco_original, categoria, emoji, estoque, vendas, badge, colecao) VALUES (?,?,?,?,?,?,?,?,?,?)'
    );
    const seed = db.transaction(() => {
      insert.run('Vaso Cerâmica Atena',      'Vaso artesanal em cerâmica esmaltada, feito à mão.',    289, null, 'Vasos',      '🏺', 15, 42, 'Novo', null);
      insert.run('Kit Velas Âmbar Selvagem', 'Kit com 3 velas de cera de soja e essência de âmbar.',  149,  210, 'Velas',      '🕯️', 30, 87, 'Oferta', null);
      insert.run('Quadro Abstrato Ouro',     'Impressão de arte abstrata com moldura dourada.',         420, null, 'Quadros',    '🖼️', 8,  31, null, 'Premium');
      insert.run('Planta Kokedama Zen',      'Planta em bola de musgo, estilo japonês.',                195, null, 'Plantas',    '🪴', 20, 55, 'Novo', null);
      insert.run('Vaso Mármore Nero',        'Vaso premium em mármore preto polido.',                   560, null, 'Premium',    '🏺', 5,  18, null, 'Premium');
      insert.run('Luminária Arco Dourado',   'Luminária de arco em metal dourado escovado.',            380,  480, 'Iluminação', '💡', 12, 29, 'Oferta', null);
      insert.run('Espelho Oval Vintage',     'Espelho oval com moldura de metal envelhecido.',           690, null, 'Premium',    '🪞', 6,  24, null, 'Premium');
      insert.run('Cesta Seagrass Natural',   'Cesta trançada artesanalmente com fibra natural.',         165, null, 'Orgânicos',  '🧺', 25, 40, 'Novo', null);
      insert.run('Difusor Bambu & Sândalo',  'Difusor de aromas em bambu com essência de sândalo.',     220, null, 'Velas',      '🌿', 18, 33, null, null);
      insert.run('Tapete Berber Marroquino', 'Tapete de lã com padrão geométrico berber.',               850, null, 'Premium',    '🪡', 4,  12, null, 'Premium');
      insert.run('Suporte Macramê',          'Suporte em macramê artesanal para vasos.',                  95, null, 'Orgânicos',  '🪢', 40, 61, null, null);
      insert.run('Relógio Parede Rústico',   'Relógio de parede em madeira de demolição.',              310, null, 'Quadros',    '🕰️', 9,  27, null, null);
    });
    seed();
    console.log('✅ Banco populado com 12 produtos!');
  }

  // Seed cupom de exemplo
  const cupomCount = db.prepare('SELECT COUNT(*) as n FROM cupons').get().n;
  if (cupomCount === 0) {
    db.prepare(`
      INSERT INTO cupons (codigo, tipo, valor, minimo_compra, usos_max) VALUES 
        ('BEMVINDO10', 'percentual', 10, 100, 999),
        ('FRETE299', 'valor', 25, 299, 999)
    `).run();
  }

  console.log('✅ Banco de dados SQLite inicializado.');
}

function getDB() {
  if (!db) throw new Error('DB não inicializado. Chame initDB() primeiro.');
  return db;
}

module.exports = { initDB, getDB };
