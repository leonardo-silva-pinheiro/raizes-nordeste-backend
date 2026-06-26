const db = require('../config/database');
const { erro } = require('../middleware/errorHandler');

const consultarFidelidade = (req, res) => {
  const clienteId = req.usuario.id;
  const fidelidade = db.prepare('SELECT * FROM fidelidade WHERE cliente_id = ?').get(clienteId);

  if (!fidelidade) {
    return res.json({ cliente_id: clienteId, pontos: 0, mensagem: 'Sem pontos acumulados ainda.' });
  }

  const historico = db.prepare(`
    SELECT id, total, criado_em, CAST(total / 10 AS INTEGER) as pontos_ganhos
    FROM pedidos WHERE cliente_id = ? AND status IN ('PAGO', 'ENTREGUE')
    ORDER BY criado_em DESC LIMIT 10
  `).all(clienteId);

  res.json({ cliente_id: clienteId, pontos: fidelidade.pontos, historico });
};

const resgatarPontos = (req, res) => {
  const { pontos } = req.body;
  const clienteId = req.usuario.id;

  if (!pontos || pontos <= 0) {
    return erro(res, 422, 'VALIDACAO', 'Informe a quantidade de pontos a resgatar.');
  }

  const fidelidade = db.prepare('SELECT * FROM fidelidade WHERE cliente_id = ?').get(clienteId);

  if (!fidelidade || fidelidade.pontos < pontos) {
    return erro(res, 409, 'PONTOS_INSUFICIENTES', `Pontos insuficientes. Saldo: ${fidelidade?.pontos || 0}`);
  }

  db.prepare('UPDATE fidelidade SET pontos = pontos - ? WHERE cliente_id = ?').run(pontos, clienteId);
  const desconto = pontos * 0.1;

  res.json({
    pontos_resgatados: pontos,
    desconto_aplicado: desconto,
    saldo_restante: fidelidade.pontos - pontos,
    mensagem: `${pontos} pontos resgatados. Desconto de R$ ${desconto.toFixed(2)} aplicado.`
  });
};

module.exports = { consultarFidelidade, resgatarPontos };
