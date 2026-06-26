# 🌵 Raízes do Nordeste — API Backend

API REST para gestão da rede de lanchonetes "Raízes do Nordeste".

## Tecnologias
- **Node.js + Express** — servidor web
- **SQLite (better-sqlite3)** — banco de dados (zero configuração)
- **JWT (jsonwebtoken)** — autenticação
- **bcryptjs** — hash de senhas (LGPD)
- **Swagger UI** — documentação interativa

## Pré-requisitos
- Node.js 18+ instalado
- npm

---

## Instalação e Execução

```bash
npm install
cp .env.example .env
npm run seed     # popula o banco com dados de teste
npm start        # ou: npm run dev
```

Acesse a documentação Swagger em:
```
http://localhost:3000/api-docs
```

---

## Usuários de Teste (após seed)

| E-mail               | Senha     | Perfil    |
|----------------------|-----------|--------   |
| admin@raizes.com     | Senha@123 | ADMIN     |
| cliente@raizes.com   | Senha@123 | CLIENTE   |
| atendente@raizes.com | Senha@123 | ATENDENTE |
| cozinha@raizes.com   | Senha@123 | COZINHA   |

---

## Fluxo Principal (Postman/Insomnia)

1. **POST** `/api/auth/login` → obter token
2. **GET** `/api/unidades/1/cardapio` → ver cardápio
3. **GET** `/api/promocoes?canal_pedido=APP` → ver promoções ativas
4. **POST** `/api/pedidos` → criar pedido (estoque + promoção + pagamento mock, tudo automático)
5. **PATCH** `/api/pedidos/1/status` → atualizar status (cozinha/atendente)
6. **GET** `/api/fidelidade` → ver pontos
7. **GET** `/api/auditoria?acao=CRIAR_PEDIDO` (ADMIN) → evidenciar log da ação sensível

---

## Endpoints Principais

| Método | Rota | Permissão |
|--------|------|-----------|
| POST | /api/auth/login | Público |
| POST | /api/auth/cadastro | Público (exige consentimento_lgpd) |
| GET | /api/unidades | Autenticado |
| GET | /api/unidades/:id/cardapio | Autenticado |
| GET | /api/produtos | Autenticado |
| POST | /api/produtos | ADMIN/GERENTE |
| GET | /api/estoque | ADMIN/GERENTE/ATENDENTE |
| PUT | /api/estoque/:pid/:uid | ADMIN/GERENTE |
| GET | /api/promocoes | Autenticado |
| POST | /api/promocoes | ADMIN/GERENTE |
| POST | /api/pedidos | CLIENTE/ATENDENTE |
| GET | /api/pedidos?canalPedido=APP | Autenticado |
| PATCH | /api/pedidos/:id/status | ADMIN/ATENDENTE/COZINHA |
| GET | /api/fidelidade | CLIENTE |
| POST | /api/fidelidade/resgatar | CLIENTE |
| GET | /api/auditoria | ADMIN |

---

## Multicanalidade

Todo pedido exige o campo `canal_pedido`:
```json
{
  "canal_pedido": "APP",
  "unidade_id": 1,
  "itens": [{"produto_id": 1, "quantidade": 2}]
}
```
Valores aceitos: `APP`, `TOTEM`, `BALCAO`, `PICKUP`, `WEB`

Filtrar por canal: `GET /api/pedidos?canalPedido=TOTEM`

---

## Promoções/Campanhas

O sistema aplica automaticamente a melhor promoção ativa compatível com o canal e a unidade do pedido (sem precisar o cliente informar nada). Promoções podem ser:
- **PERCENTUAL** (ex: 10% de desconto)
- **VALOR_FIXO** (ex: R$ 5,00 de desconto)

Cadastradas via `POST /api/promocoes` (ADMIN/GERENTE) com `canal_pedido` e/ou `unidade_id` opcionais (regra abrangente quando nulos).

---

## Segurança e LGPD
- Senhas armazenadas com **bcrypt** (hash)
- Autenticação via **JWT Bearer Token**
- Controle de acesso por **roles/perfis**
- **Consentimento LGPD** obrigatório no cadastro (422 se ausente)
- **Logs de auditoria** em login, cadastro, criação de pedido e mudança de status — consultáveis via `GET /api/auditoria` (ADMIN)
- Dados sensíveis (senha) nunca retornados nas respostas

---

## Limitações conhecidas / próximos passos
- Pagamento é 100% mock (`Math.random() > 0.2`); não há integração real.
- Não há testes automatizados de unidade (Jest), apenas a coleção Postman com `pm.test`.
- Migrations são `CREATE TABLE IF NOT EXISTS` no boot, não migrations versionadas.
