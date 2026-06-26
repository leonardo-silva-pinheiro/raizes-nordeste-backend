const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'raizes_nordeste_secret_2026';

const erroAuth = (res, code, message) => {
  res.status(code).json({
    error: code === 401 ? 'NAO_AUTENTICADO' : 'SEM_PERMISSAO',
    message,
    timestamp: new Date().toISOString(),
    path: res.req?.path || ''
  });
};

const autenticar = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return erroAuth(res, 401, 'Token de autenticação não informado.');

  try {
    req.usuario = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return erroAuth(res, 401, 'Token inválido ou expirado.');
  }
};

const autorizar = (...roles) => (req, res, next) => {
  if (!req.usuario) return erroAuth(res, 401, 'Não autenticado.');
  if (!roles.includes(req.usuario.role)) {
    return erroAuth(res, 403, `Acesso negado. Requer perfil: ${roles.join(' ou ')}.`);
  }
  next();
};

module.exports = { autenticar, autorizar, JWT_SECRET };
