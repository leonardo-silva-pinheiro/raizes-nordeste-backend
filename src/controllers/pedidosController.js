const db = require('../config/database');
const { erro } = require('../middleware/errorHandler');
const auditoria = require('../services/auditoria');
const { calcularMelhorPromocao } = require('./promocoesController');

const pagamentoMock = () => Math.random() > 0.2;

const criarPedido = (req, res) => {
  const { unidade_id, canal_pedido, itens, forma_pagamento } = req.body;
  const cliente_id = req.usuario.id;

  if (!canal_pedido) {
    return erro(res, 422, 'VALIDACAO', 'O campo canalPedido é obrigatório.', [
      { field: 'canal_pedido', issue: 'Campo obrigatório. Valores: APP, TOTEM, BALCAO, PICKUP, WEB' }
    ]);
  }

  const canaisValidos = ['APP', 'TOTEM', 'BALCAO', 'PICKUP', 'WEB'];
  if (!canaisValidos.includes(canal_pedido)) {
    return erro(res, 422, 'CANAL_INVALIDO', `Canal inválido. Use: ${canaisValidos.join(', ')}`);
  }

  if (!unidade_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return erro(res, 422, 'VALIDACAO', 'Unidade e itens são obrigatórios.');
  }

  const unidade = db.prepare('SELECT * FROM unidades WHERE id = ? AND ativo = 1').get(unidade_id);
  if (!unidade) return erro(res, 404, 'UNIDADE_NAO_ENCONTRADA', 'Unidade não encontrada.');

  let totalBruto = 0;
  const itensValidados = [];

  for (const item of itens) {
    const produto = db.prepare('SELECT * FROM produtos WHERE id = ? AND ativo = 1').get(item.produto_id);
    if (!produto) return erro(res, 404, 'PRODUTO_NAO_ENCONTRADO', `Produto ${item.produto_id} não encontrado.`);

    const estoqueItem = db.prepare(
      'SELECT quantidade FROM estoque WHERE produto_id = ? AND unidade_id = ?'
    ).get(item.produto_id, unidade_id);

    if (!estoqueItem || estoqueItem.quantidade < item.quantidade) {
      return erro(res, 409, 'ESTOQUE_INSUFICIENTE',
        `Estoque insuficiente para o produto "${produto.nome}".`, [
          { field: `itens[produto_id=${item.produto_id}].quantidade`, issue: `Disponível: ${estoqueItem?.quantidade || 0}` }
        ]);
    }

    totalBruto += produto.preco * item.quantidade;
    itensValidados.push({ produto, quantidade: item.quantidade });
  }

  // Promoções/campanhas: aplica automaticamente a melhor promoção compatível com canal/unidade
  const { promocaoId, desconto } = calcularMelhorPromocao(canal_pedido, unidade_id, totalBruto);
  const total = Number((totalBruto - desconto).toFixed(2));

  const criarPedidoTx = db.transaction(() => {
    const pedidoResult = db.prepare(`
      INSERT INTO pedidos (cliente_id, unidade_id, canal_pedido, promocao_id, desconto_aplicado, total)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(cliente_id, unidade_id, canal_pedido, promocaoId, desconto, total);

    const pedidoId = pedidoResult.lastInsertRowid;

    for (const { produto, quantidade } of itensValidados) {
      db.prepare(`
        INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
        VALUES (?, ?, ?, ?)
      `).run(pedidoId, produto.id, quantidade, produto.preco);

      db.prepare(`
        UPDATE estoque SET quantidade = quantidade - ?
        WHERE produto_id = ? AND unidade_id = ?
      `).run(quantidade, produto.id, unidade_id);
    }

    const aprovado = pagamentoMock();
    const statusPagamento = aprovado ? 'APROVADO' : 'RECUSADO';

    db.prepare(`
      INSERT INTO pagamentos (pedido_id, status, forma_pagamento, payload)
      VALUES (?, ?, ?, ?)
    `).run(pedidoId, statusPagamento, forma_pagamento || 'MOCK', JSON.stringify({ aprovado, timestamp: new Date().toISOString() }));

    if (aprovado) {
      db.prepare("UPDATE pedidos SET status = 'PAGO' WHERE id = ?").run(pedidoId);

      const pontosGanhos = Math.floor(total / 10);
      if (pontosGanhos > 0) {
        db.prepare(`
          INSERT INTO fidelidade (cliente_id, pontos) VALUES (?, ?)
          ON CONFLICT(cliente_id) DO UPDATE SET pontos = pontos + ?
        `).run(cliente_id, pontosGanhos, pontosGanhos);
      }
    }

    return { pedidoId, statusPagamento, aprovado };
  });

  const { pedidoId, statusPagamento, aprovado } = criarPedidoTx();

  auditoria.log(cliente_id, 'CRIAR_PEDIDO', { pedidoId, canal_pedido, total, statusPagamento, promocaoId });

  const itensSaida = itensValidados.map(({ produto, quantidade }) => ({
    produto_id: produto.id,
    produto: produto.nome,
    quantidade,
    preco_unitario: produto.preco,
    subtotal: produto.preco * quantidade
  }));

  res.status(201).json({
    pedido_id: pedidoId,
    status: aprovado ? 'PAGO' : 'AGUARDANDO_PAGAMENTO',
    canal_pedido,
    subtotal: totalBruto,
    promocao_aplicada: promocaoId ? { id: promocaoId, desconto } : null,
    total,
    itens: itensSaida,
    pagamento: {
      status: statusPagamento,
      aprovado,
      mensagem: aprovado ? 'Pagamento aprovado!' : 'Pagamento recusado. Tente novamente.'
    },
    criado_em: new Date().toISOString()
  });
};

const listarPedidos = (req, res) => {
  const { canalPedido, status, page = 1, limit = 10 } = req.query;
  const usuario = req.usuario;
  const offset = (parseInt(page) - 1) * parseInt(limit);

  let where = '1=1';
  const params = [];

  if (usuario.role === 'CLIENTE') {
    where += ' AND p.cliente_id = ?';
    params.push(usuario.id);
  }

  if (canalPedido) { where += ' AND p.canal_pedido = ?'; params.push(canalPedido); }
  if (status) { where += ' AND p.status = ?'; params.push(status); }

  const total = db.prepare(`SELECT COUNT(*) as c FROM pedidos p WHERE ${where}`).get(...params).c;
  const pedidos = db.prepare(`
    SELECT p.*, u.nome as unidade, usr.nome as cliente
    FROM pedidos p
    JOIN unidades u ON u.id = p.unidade_id
    JOIN usuarios usr ON usr.id = p.cliente_id
    WHERE ${where}
    ORDER BY p.criado_em DESC
    LIMIT ? OFFSET ?
  `).all(...params, parseInt(limit), offset);

  res.json({ total, page: parseInt(page), limit: parseInt(limit), data: pedidos });
};

const buscarPedido = (req, res) => {
  const usuario = req.usuario;
  const pedido = db.prepare(`
    SELECT p.*, u.nome as unidade, usr.nome as cliente
    FROM pedidos p
    JOIN unidades u ON u.id = p.unidade_id
    JOIN usuarios usr ON usr.id = p.cliente_id
    WHERE p.id = ?
  `).get(req.params.id);

  if (!pedido) return erro(res, 404, 'PEDIDO_NAO_ENCONTRADO', 'Pedido não encontrado.');
  if (usuario.role === 'CLIENTE' && pedido.cliente_id !== usuario.id) {
    return erro(res, 403, 'SEM_PERMISSAO', 'Você não tem acesso a este pedido.');
  }

  const itens = db.prepare(`
    SELECT i.*, p.nome as produto
    FROM itens_pedido i JOIN produtos p ON p.id = i.produto_id
    WHERE i.pedido_id = ?
  `).all(req.params.id);

  const pagamento = db.prepare('SELECT * FROM pagamentos WHERE pedido_id = ?').get(req.params.id);

  res.json({ ...pedido, itens, pagamento });
};

const atualizarStatus = (req, res) => {
  const { status } = req.body;
  const statusValidos = ['EM_PREPARO', 'PRONTO', 'ENTREGUE', 'CANCELADO'];

  if (!statusValidos.includes(status)) {
    return erro(res, 422, 'STATUS_INVALIDO', `Status inválido. Use: ${statusValidos.join(', ')}`);
  }

  const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(req.params.id);
  if (!pedido) return erro(res, 404, 'PEDIDO_NAO_ENCONTRADO', 'Pedido não encontrado.');
  if (pedido.status === 'CANCELADO' || pedido.status === 'ENTREGUE') {
    return erro(res, 409, 'STATUS_INVALIDO', 'Pedido já finalizado, não pode ser alterado.');
  }

  db.prepare('UPDATE pedidos SET status = ? WHERE id = ?').run(status, req.params.id);
  auditoria.log(req.usuario.id, 'ATUALIZAR_STATUS_PEDIDO', { pedidoId: req.params.id, statusAnterior: pedido.status, novoStatus: status });

  res.json({ pedido_id: parseInt(req.params.id), status_anterior: pedido.status, novo_status: status });
};

module.exports = { criarPedido, listarPedidos, buscarPedido, atualizarStatus };
