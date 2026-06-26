const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');
const { erro } = require('../middleware/errorHandler');
const auditoria = require('../services/auditoria');

const login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return erro(res, 422, 'VALIDACAO', 'E-mail e senha são obrigatórios.', [
      !email && { field: 'email', issue: 'Campo obrigatório' },
      !senha && { field: 'senha', issue: 'Campo obrigatório' }
    ].filter(Boolean));
  }

  const usuario = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email);

  if (!usuario || !bcrypt.compareSync(senha, usuario.senha)) {
    return erro(res, 401, 'CREDENCIAIS_INVALIDAS', 'E-mail ou senha inválidos.');
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role, nome: usuario.nome },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  auditoria.log(usuario.id, 'LOGIN', { email: usuario.email });

  res.json({
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: 28800,
    user: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.role }
  });
};

const cadastro = (req, res) => {
  const { nome, email, senha, consentimento_lgpd } = req.body;

  if (!nome || !email || !senha) {
    return erro(res, 422, 'VALIDACAO', 'Campos obrigatórios não informados.', [
      !nome && { field: 'nome', issue: 'Campo obrigatório' },
      !email && { field: 'email', issue: 'Campo obrigatório' },
      !senha && { field: 'senha', issue: 'Campo obrigatório' }
    ].filter(Boolean));
  }

  if (!consentimento_lgpd) {
    return erro(res, 422, 'LGPD_CONSENTIMENTO', 'Consentimento LGPD é obrigatório para cadastro.');
  }

  const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email);
  if (existente) return erro(res, 409, 'EMAIL_DUPLICADO', 'E-mail já cadastrado.');

  const senhaHash = bcrypt.hashSync(senha, 10);

  const result = db.prepare(`
    INSERT INTO usuarios (nome, email, senha, role, consentimento_lgpd)
    VALUES (?, ?, ?, 'CLIENTE', ?)
  `).run(nome, email, senhaHash, consentimento_lgpd ? 1 : 0);

  db.prepare('INSERT INTO fidelidade (cliente_id, pontos) VALUES (?, 0)').run(result.lastInsertRowid);

  auditoria.log(result.lastInsertRowid, 'CADASTRO', { email });

  res.status(201).json({
    id: result.lastInsertRowid,
    nome, email,
    perfil: 'CLIENTE',
    message: 'Cadastro realizado com sucesso.'
  });
};

module.exports = { login, cadastro };
