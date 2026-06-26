const db = require('../config/database');

const log = (usuarioId, acao, detalhes) => {
  try {
    db.prepare(`INSERT INTO logs_auditoria (usuario_id, acao, detalhes) VALUES (?, ?, ?)`)
      .run(usuarioId || null, acao, JSON.stringify(detalhes) || null);
  } catch (e) {
    console.error('Erro ao registrar log:', e.message);
  }
};

module.exports = { log };
