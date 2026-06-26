const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../raizes.db');

const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CLIENTE' CHECK(role IN ('CLIENTE','ADMIN','ATENDENTE','COZINHA','GERENTE')),
    consentimento_lgpd INTEGER NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS unidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    preco REAL NOT NULL,
    ativo INTEGER NOT NULL DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS estoque (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER NOT NULL,
    unidade_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (produto_id) REFERENCES produtos(id),
    FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    UNIQUE(produto_id, unidade_id)
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL,
    unidade_id INTEGER NOT NULL,
    canal_pedido TEXT NOT NULL CHECK(canal_pedido IN ('APP','TOTEM','BALCAO','PICKUP','WEB')),
    status TEXT NOT NULL DEFAULT 'AGUARDANDO_PAGAMENTO'
      CHECK(status IN ('AGUARDANDO_PAGAMENTO','PAGO','CANCELADO','EM_PREPARO','PRONTO','ENTREGUE')),
    promocao_id INTEGER,
    desconto_aplicado REAL NOT NULL DEFAULT 0,
    total REAL NOT NULL DEFAULT 0,
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (unidade_id) REFERENCES unidades(id),
    FOREIGN KEY (promocao_id) REFERENCES promocoes(id)
  );

  CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco_unitario REAL NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  );

  CREATE TABLE IF NOT EXISTS pagamentos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK(status IN ('APROVADO','RECUSADO','PENDENTE')),
    forma_pagamento TEXT NOT NULL DEFAULT 'MOCK',
    payload TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
  );

  CREATE TABLE IF NOT EXISTS fidelidade (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER NOT NULL UNIQUE,
    pontos INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id)
  );

  CREATE TABLE IF NOT EXISTS promocoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL CHECK(tipo IN ('PERCENTUAL','VALOR_FIXO')),
    valor REAL NOT NULL,
    canal_pedido TEXT CHECK(canal_pedido IN ('APP','TOTEM','BALCAO','PICKUP','WEB') OR canal_pedido IS NULL),
    unidade_id INTEGER,
    ativo INTEGER NOT NULL DEFAULT 1,
    valido_ate TEXT,
    FOREIGN KEY (unidade_id) REFERENCES unidades(id)
  );

  CREATE TABLE IF NOT EXISTS logs_auditoria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    acao TEXT NOT NULL,
    detalhes TEXT,
    criado_em TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

module.exports = db;
