const db = require('../config/database');
const { erro } = require('../middleware/errorHandler');

const listarUnidades = (req, res) => {
  const unidades = db.prepare('SELECT * FROM unidades WHERE ativo = 1').all();
  res.json({ total: unidades.length, data: unidades });
};

const listarProdutos = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const total = db.prepare('SELECT COUNT(*) as c FROM produtos WHERE ativo = 1').get().c;
  const produtos = db.prepare('SELECT * FROM produtos WHERE ativo = 1 LIMIT ? OFFSET ?').all(limit, offset);

  res.json({ total, page, limit, data: produtos });
};

const buscarProduto = (req, res) => {
  const produto = db.prepare('SELECT * FROM produtos WHERE id = ? AND ativo = 1').get(req.params.id);
  if (!produto) return erro(res, 404, 'PRODUTO_NAO_ENCONTRADO', 'Produto não encontrado.');
  res.json(produto);
};

const criarProduto = (req, res) => {
  const { nome, descricao, preco } = req.body;
  if (!nome || !preco) return erro(res, 422, 'VALIDACAO', 'Nome e preço são obrigatórios.');
  const result = db.prepare('INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)').run(nome, descricao || '', preco);
  res.status(201).json({ id: result.lastInsertRowid, nome, descricao, preco });
};

const cardapioPorUnidade = (req, res) => {
  const { id } = req.params;
  const unidade = db.prepare('SELECT * FROM unidades WHERE id = ? AND ativo = 1').get(id);
  if (!unidade) return erro(res, 404, 'UNIDADE_NAO_ENCONTRADA', 'Unidade não encontrada.');

  const cardapio = db.prepare(`
    SELECT p.id, p.nome, p.descricao, p.preco, e.quantidade
    FROM produtos p
    INNER JOIN estoque e ON e.produto_id = p.id
    WHERE e.unidade_id = ? AND p.ativo = 1 AND e.quantidade > 0
  `).all(id);

  res.json({ unidade, cardapio });
};

const consultarEstoque = (req, res) => {
  const { unidade_id } = req.query;
  let query = `
    SELECT e.id, p.nome as produto, u.nome as unidade, e.quantidade
    FROM estoque e
    JOIN produtos p ON p.id = e.produto_id
    JOIN unidades u ON u.id = e.unidade_id
    WHERE 1=1
  `;
  const params = [];
  if (unidade_id) { query += ' AND e.unidade_id = ?'; params.push(unidade_id); }

  const estoque = db.prepare(query).all(...params);
  res.json({ total: estoque.length, data: estoque });
};

const atualizarEstoque = (req, res) => {
  const { produto_id, unidade_id } = req.params;
  const { quantidade } = req.body;

  if (quantidade === undefined || quantidade < 0) {
    return erro(res, 422, 'VALIDACAO', 'Quantidade inválida.');
  }

  db.prepare(`
    INSERT INTO estoque (produto_id, unidade_id, quantidade)
    VALUES (?, ?, ?)
    ON CONFLICT(produto_id, unidade_id) DO UPDATE SET quantidade = ?
  `).run(produto_id, unidade_id, quantidade, quantidade);

  res.json({ message: 'Estoque atualizado.', produto_id, unidade_id, quantidade });
};

module.exports = { listarUnidades, listarProdutos, buscarProduto, criarProduto, cardapioPorUnidade, consultarEstoque, atualizarEstoque };