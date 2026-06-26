const db = require('../config/database');

// GET /auditoria — apenas ADMIN, permite evidenciar nos testes que ações sensíveis geram log
const listarLogs = (req, res) => {
  const { acao, usuario_id, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = '1=1';
  const params = [];
  if (acao) { where += ' AND l.acao = ?'; params.push(acao); }
  if (usuario_id) { where += ' AND l.usuario_id = ?'; params.push(usuario_id); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM logs_auditoria l WHERE ${where}`).get(...params).c;
  const logs = db.prepare(`
    SELECT l.id, l.usuario_id, u.nome as usuario, l.acao, l.detalhes, l.criado_em
    FROM logs_auditoria l
    LEFT JOIN usuarios u ON u.id = l.usuario_id
    WHERE ${where}
    ORDER BY l.criado_em DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ total, page: parseInt(page), limit: parseInt(limit), data: logs });
};

module.exports = { listarLogs };
