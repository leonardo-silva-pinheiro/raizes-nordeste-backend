const erro = (res, status, code, message, details = []) => {
  return res.status(status).json({
    error: code,
    message,
    details,
    timestamp: new Date().toISOString(),
    path: res.req?.originalUrl || ''
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err);
  return erro(res, 500, 'ERRO_INTERNO', 'Erro interno do servidor.');
};

module.exports = { erro, errorHandler };
