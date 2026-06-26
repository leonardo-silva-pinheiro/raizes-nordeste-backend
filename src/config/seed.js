const bcrypt = require('bcryptjs');
const db = require('./database');

console.log('Populando banco de dados...');

db.exec(`
  DELETE FROM logs_auditoria;
  DELETE FROM fidelidade;
  DELETE FROM pagamentos;
  DELETE FROM itens_pedido;
  DELETE FROM pedidos;
  DELETE FROM promocoes;
  DELETE FROM estoque;
  DELETE FROM produtos;
  DELETE FROM unidades;
  DELETE FROM usuarios;
  DELETE FROM sqlite_sequence; 
`);

const senhaHash = bcrypt.hashSync('Senha@123', 10);

const insertUsuario = db.prepare(`
  INSERT INTO usuarios (nome, email, senha, role, consentimento_lgpd)
  VALUES (?, ?, ?, ?, ?)
`);

insertUsuario.run('Administrador', 'admin@raizes.com', senhaHash, 'ADMIN', 1);
insertUsuario.run('Maria Silva', 'cliente@raizes.com', senhaHash, 'CLIENTE', 1);
insertUsuario.run('João Atendente', 'atendente@raizes.com', senhaHash, 'ATENDENTE', 1);
insertUsuario.run('Cozinha Recife', 'cozinha@raizes.com', senhaHash, 'COZINHA', 1);

const insertUnidade = db.prepare(`INSERT INTO unidades (nome, cidade) VALUES (?, ?)`);
insertUnidade.run('Raízes do Nordeste - Recife Centro', 'Recife');
insertUnidade.run('Raízes do Nordeste - Fortaleza', 'Fortaleza');
insertUnidade.run('Raízes do Nordeste - Salvador', 'Salvador');

const insertProduto = db.prepare(`INSERT INTO produtos (nome, descricao, preco) VALUES (?, ?, ?)`);
insertProduto.run('Cuscuz com Queijo', 'Cuscuz nordestino com queijo coalho', 12.90);
insertProduto.run('Tapioca Recheada', 'Tapioca com queijo e manteiga de garrafa', 10.50);
insertProduto.run('Bolo de Macaxeira', 'Bolo úmido de macaxeira com coco', 8.00);
insertProduto.run('Suco de Caju', 'Suco natural de caju 500ml', 7.00);
insertProduto.run('Café Nordestino', 'Café coado na hora', 4.50);
insertProduto.run('Combo Café da Manhã', 'Cuscuz + Tapioca + Café', 22.90);

const insertEstoque = db.prepare(`INSERT INTO estoque (produto_id, unidade_id, quantidade) VALUES (?, ?, ?)`);
for (let p = 1; p <= 6; p++) insertEstoque.run(p, 1, 50);
for (let p = 1; p <= 4; p++) insertEstoque.run(p, 2, 30);
insertEstoque.run(1, 3, 20);
insertEstoque.run(2, 3, 15);

db.prepare('INSERT INTO fidelidade (cliente_id, pontos) VALUES (?, ?)').run(2, 50);

// Promoções/campanhas — RF obrigatório do roteiro
const insertPromo = db.prepare(`
  INSERT INTO promocoes (nome, descricao, tipo, valor, canal_pedido, unidade_id, valido_ate)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);
insertPromo.run('Junina App', '10% de desconto em pedidos pelo aplicativo no período junino', 'PERCENTUAL', 10, 'APP', null, '2026-06-30');
insertPromo.run('Combo Totem', 'R$ 5,00 de desconto em pedidos feitos no totem', 'VALOR_FIXO', 5.00, 'TOTEM', null, '2026-12-31');
insertPromo.run('Fidelidade Recife', '15% de desconto exclusivo na unidade Recife Centro', 'PERCENTUAL', 15, null, 1, '2026-12-31');

console.log('✅ Banco populado com sucesso!');
console.log('Usuários: admin@raizes.com / cliente@raizes.com / atendente@raizes.com / cozinha@raizes.com — senha: Senha@123');
