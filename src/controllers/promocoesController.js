const db = require('../config/database');
const { erro } = require('../middleware/errorHandler');

// GET /promocoes — lista promoções ativas, opcionalmente filtradas por canal/unidade
const listarPromocoes = (req, res) => {
  const { canal_pedido, unidade_id } = req.query;
  let query = `SELECT * FROM promocoes WHERE ativo = 1 AND (valido_ate IS NULL OR valido_ate >= date('now'))`;
  const params = [];

  if (canal_pedido) {
    query += ' AND (canal_pedido = ? OR canal_pedido IS NULL)';
    params.push(canal_pedido);
  }
  if (unidade_id) {
    query += ' AND (unidade_id = ? OR unidade_id IS NULL)';
    params.push(unidade_id);
  }

  const promocoes = db.prepare(query).all(...params);
  res.json({ total: promocoes.length, data: promocoes });
};

// POST /promocoes (ADMIN/GERENTE) — cadastrar campanha
const criarPromocao = (req, res) => {
  const { nome, descricao, tipo, valor, canal_pedido, unidade_id, valido_ate } = req.body;

  if (!nome || !tipo || valor === undefined) {
    return erro(res, 422, 'VALIDACAO', 'Nome, tipo e valor são obrigatórios.', [
      !nome && { field: 'nome', issue: 'Campo obrigatório' },
      !tipo && { field: 'tipo', issue: 'Use PERCENTUAL ou VALOR_FIXO' },
      valor === undefined && { field: 'valor', issue: 'Campo obrigatório' }
    ].filter(Boolean));
  }

  if (!['PERCENTUAL', 'VALOR_FIXO'].includes(tipo)) {
    return erro(res, 422, 'TIPO_INVALIDO', 'Tipo deve ser PERCENTUAL ou VALOR_FIXO.');
  }

  const result = db.prepare(`
    INSERT INTO promocoes (nome, descricao, tipo, valor, canal_pedido, unidade_id, valido_ate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(nome, descricao || '', tipo, valor, canal_pedido || null, unidade_id || null, valido_ate || null);

  res.status(201).json({ id: result.lastInsertRowid, nome, tipo, valor, canal_pedido, unidade_id, valido_ate });
};

// Função auxiliar usada pelo pedidosController para aplicar desconto automaticamente
// Regra: aplica a melhor promoção ativa compatível com canal e unidade do pedido
const calcularMelhorPromocao = (canalPedido, unidadeId, totalBruto) => {
  const promocoes = db.prepare(`
    SELECT * FROM promocoes
    WHERE ativo = 1
      AND (valido_ate IS NULL OR valido_ate >= date('now'))
      AND (canal_pedido = ? OR canal_pedido IS NULL)
      AND (unidade_id = ? OR unidade_id IS NULL)
  `).all(canalPedido, unidadeId);

  if (promocoes.length === 0) return { promocaoId: null, desconto: 0 };

  let melhor = { promocaoId: null, desconto: 0 };
  for (const promo of promocoes) {
    const desconto = promo.tipo === 'PERCENTUAL'
      ? totalBruto * (promo.valor / 100)
      : promo.valor;
    if (desconto > melhor.desconto) {
      melhor = { promocaoId: promo.id, desconto: Math.min(desconto, totalBruto) };
    }
  }
  return melhor;
};

module.exports = { listarPromocoes, criarPromocao, calcularMelhorPromocao };
