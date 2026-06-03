🌵 Raízes do Nordeste API

Sistema backend desenvolvido em Django REST Framework para gerenciamento de restaurante nordestino, com controle de pedidos, estoque, produtos, fidelidade, autenticação JWT e administração completa.

📌 Sobre o Projeto

O Raízes do Nordeste API foi desenvolvido com o objetivo de simular um sistema real de gestão para restaurantes, permitindo:

Controle de produtos
Controle de estoque
Gestão de pedidos
Multiunidade
Fidelidade de clientes
Administração via painel Django
API REST documentada
Autenticação JWT

O projeto foi construído utilizando boas práticas de desenvolvimento backend com Django e PostgreSQL.

🚀 Tecnologias Utilizadas
Backend
Python 3
Django
Django REST Framework
PostgreSQL
Simple JWT
Django Jazzmin
Documentação
Swagger / OpenAPI
Versionamento
Git
GitHub
🏗️ Arquitetura do Projeto
raizes-do-nordeste/
│
├── config/
├── usuarios/
├── produtos/
├── estoque/
├── pedidos/
├── fidelidade/
├── unidades/
├── manage.py
├── requirements.txt
└── README.md
✅ Funcionalidades
👤 Usuários
Cadastro de usuários
Login JWT
Controle de autenticação
Diferentes tipos de usuários
🍛 Produtos
Cadastro de produtos
Preço automático
Categoria de produtos
Administração completa
📦 Estoque
Controle de estoque por unidade
Soma automática ao adicionar item existente
Validação de estoque insuficiente
Atualização automática
🧾 Pedidos
Criação de pedidos
Itens do pedido
Cálculo automático de subtotal
Cálculo automático de total
Controle de status:
Aguardando pagamento
Pago
Em preparo
Pronto
Entregue
Cancelado
🔄 Regras de Negócio
✅ Baixa automática de estoque

Ao criar um pedido:

o estoque é reduzido automaticamente
✅ Cancelamento inteligente

Ao cancelar um pedido:

os produtos retornam automaticamente ao estoque
✅ Cálculo automático

O sistema calcula automaticamente:

preço unitário
subtotal
total do pedido
🏪 Multiunidade

Controle separado de:

estoque
pedidos
produtos por unidade
🎁 Fidelidade
Controle de pontos
Relacionamento com clientes
🔐 JWT Authentication

Autenticação utilizando:

Access Token
Refresh Token

Endpoints:

/api/token/
/api/token/refresh/
📘 Documentação da API

Swagger disponível em:

http://127.0.0.1:8000/api/docs/
⚙️ Instalação do Projeto
1. Clonar o repositório
git clone https://github.com/SEUUSUARIO/raizes-do-nordeste.git
2. Entrar na pasta
cd raizes-do-nordeste
3. Criar ambiente virtual
python -m venv venv
4. Ativar ambiente virtual
Windows
venv\Scripts\activate
Linux/Mac
source venv/bin/activate
5. Instalar dependências
pip install -r requirements.txt
6. Configurar banco PostgreSQL

Editar o arquivo:

config/settings.py

Exemplo:

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'raizes_db',
        'USER': 'postgres',
        'PASSWORD': 'sua_senha',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
7. Executar migrations
python manage.py migrate
8. Criar superusuário
python manage.py createsuperuser
9. Rodar servidor
python manage.py runserver
🔑 Autenticação JWT
Gerar Token

Endpoint:

/api/token/

Exemplo:

{
  "username": "admin",
  "password": "123456"
}
Utilizar Token
Authorization: Bearer SEU_TOKEN
🛠️ Painel Administrativo

Acesso:

http://127.0.0.1:8000/admin/

O sistema utiliza:

Django Admin
Tema Jazzmin
Filtros
Pesquisa
Interface customizada
📌 Regras Importantes do Sistema
Estoque
Não permite estoque negativo
Atualiza automaticamente
Pedidos
Total automático
Itens automáticos
Cancelamento devolve estoque
Segurança
Endpoints protegidos
JWT obrigatório
Controle de permissões
🧪 Testes Realizados

Fluxos testados:

Cadastro de produtos
Criação de estoque
Login JWT
Criação de pedidos
Baixa automática de estoque
Cancelamento de pedidos
Retorno automático ao estoque
👨‍💻 Autor
Leonardo SIlva Pinheiro

Projeto acadêmico desenvolvido para estudo de:

Backend
APIs REST
Django
PostgreSQL
Arquitetura de sistemas
📄 Licença

Este projeto é destinado para fins acadêmicos e de aprendizado.