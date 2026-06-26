const express = require('express');
const router = express.Router();
const { autenticar, autorizar } = require('../middleware/auth');

const authCtrl = require('../controllers/authController');
const prodCtrl = require('../controllers/produtosController');
const pedCtrl = require('../controllers/pedidosController');
const fidCtrl = require('../controllers/fidelidadeController');
const promoCtrl = require('../controllers/promocoesController');
const auditCtrl = require('../controllers/auditoriaController');

// ==================== AUTH ====================
router.post('/auth/login', authCtrl.login);
router.post('/auth/cadastro', authCtrl.cadastro);

// ==================== UNIDADES ====================
router.get('/unidades', autenticar, prodCtrl.listarUnidades);
router.get('/unidades/:id/cardapio', autenticar, prodCtrl.cardapioPorUnidade);

// ==================== PRODUTOS ====================
router.get('/produtos', autenticar, prodCtrl.listarProdutos);
router.get('/produtos/:id', autenticar, prodCtrl.buscarProduto);
router.post('/produtos', autenticar, autorizar('ADMIN', 'GERENTE'), prodCtrl.criarProduto);

// ==================== ESTOQUE ====================
router.get('/estoque', autenticar, autorizar('ADMIN', 'GERENTE', 'ATENDENTE'), prodCtrl.consultarEstoque);
router.put('/estoque/:produto_id/:unidade_id', autenticar, autorizar('ADMIN', 'GERENTE'), prodCtrl.atualizarEstoque);

// ==================== PEDIDOS ====================
router.post('/pedidos', autenticar, autorizar('CLIENTE', 'ATENDENTE'), pedCtrl.criarPedido);
router.get('/pedidos', autenticar, pedCtrl.listarPedidos);
router.get('/pedidos/:id', autenticar, pedCtrl.buscarPedido);
router.patch('/pedidos/:id/status', autenticar, autorizar('ADMIN', 'ATENDENTE', 'COZINHA', 'GERENTE'), pedCtrl.atualizarStatus);

// ==================== FIDELIDADE ====================
router.get('/fidelidade', autenticar, autorizar('CLIENTE'), fidCtrl.consultarFidelidade);
router.post('/fidelidade/resgatar', autenticar, autorizar('CLIENTE'), fidCtrl.resgatarPontos);

// ==================== PROMOÇÕES ====================
router.get('/promocoes', autenticar, promoCtrl.listarPromocoes);
router.post('/promocoes', autenticar, autorizar('ADMIN', 'GERENTE'), promoCtrl.criarPromocao);

// ==================== AUDITORIA ====================
router.get('/auditoria', autenticar, autorizar('ADMIN'), auditCtrl.listarLogs);

module.exports = router;
