# 🌵 Raízes do Nordeste API

Sistema backend desenvolvido com Django REST Framework para gerenciamento de restaurante nordestino, com controle de pedidos, estoque, produtos, fidelidade, autenticação JWT e administração completa.

---

# 📌 Sobre o Projeto

O **Raízes do Nordeste API** foi desenvolvido com o objetivo de simular um sistema real de gestão para restaurantes, permitindo:

* Controle de produtos
* Controle de estoque
* Gestão de pedidos
* Multiunidade
* Fidelidade de clientes
* Administração via painel Django
* API REST documentada
* Autenticação JWT

O projeto foi construído utilizando boas práticas de desenvolvimento backend com Django e PostgreSQL.

---

# 🚀 Tecnologias Utilizadas

## Backend

* Python 3
* Django
* Django REST Framework
* PostgreSQL
* Simple JWT
* Django Jazzmin

## Documentação

* Swagger / OpenAPI

## Versionamento

* Git
* GitHub

---

# 🏗️ Estrutura do Projeto

```bash
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
```

---

# ✅ Funcionalidades

## 👤 Usuários

* Cadastro de usuários
* Login JWT
* Controle de autenticação

---

## 🍛 Produtos

* Cadastro de produtos
* Controle de preços
* Administração completa

---

## 📦 Estoque

* Controle de estoque por unidade
* Soma automática de itens repetidos
* Validação de estoque insuficiente

---

## 🧾 Pedidos

* Criação de pedidos
* Itens do pedido
* Cálculo automático de subtotal
* Cálculo automático de total
* Controle de status

### Status disponíveis

* AGUARDANDO_PAGAMENTO
* PAGO
* EM_PREPARO
* PRONTO
* ENTREGUE
* CANCELADO

---

# 🔄 Regras de Negócio

## ✅ Baixa automática de estoque

Ao criar um pedido, o estoque é reduzido automaticamente.

## ✅ Cancelamento inteligente

Ao cancelar um pedido, os produtos retornam automaticamente ao estoque.

## ✅ Cálculo automático

O sistema calcula automaticamente:

* preço unitário
* subtotal
* total do pedido

---

# 🏪 Multiunidade

Controle separado de:

* estoque
* pedidos
* produtos por unidade

---

# 🎁 Fidelidade

* Controle de pontos
* Relacionamento com clientes

---

# 🔐 JWT Authentication

Endpoints:

```bash
/api/token/
/api/token/refresh/
```

---

# 📘 Documentação da API

Swagger disponível em:

```bash
http://127.0.0.1:8000/api/docs/
```

---

# ⚙️ Instalação do Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/SEUUSUARIO/raizes-do-nordeste.git
```

---

## 2. Entrar na pasta do projeto

```bash
cd raizes-do-nordeste
```

---

## 3. Criar ambiente virtual

```bash
python -m venv venv
```

---

## 4. Ativar ambiente virtual

### Windows

```bash
venv\Scripts\activate
```

### Linux/Mac

```bash
source venv/bin/activate
```

---

## 5. Instalar dependências

```bash
pip install -r requirements.txt
```

---

## 6. Configurar PostgreSQL

Editar:

```bash
config/settings.py
```

Exemplo:

```python
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
```

---

## 7. Executar migrations

```bash
python manage.py migrate
```

---

## 8. Criar superusuário

```bash
python manage.py createsuperuser
```

---

## 9. Rodar servidor

```bash
python manage.py runserver
```

---

# 🔑 Autenticação JWT

## Gerar Token

Endpoint:

```bash
/api/token/
```

Exemplo:

```json
{
  "username": "admin",
  "password": "123456"
}
```

---

## Utilizar Token

```bash
Authorization: Bearer SEU_TOKEN
```

---

# 🛠️ Painel Administrativo

Acesso:

```bash
http://127.0.0.1:8000/admin/
```

Recursos:

* Django Admin
* Tema Jazzmin
* Filtros
* Pesquisa
* Interface customizada

---

# 🧪 Testes Realizados

Fluxos testados:

* Cadastro de produtos
* Criação de estoque
* Login JWT
* Criação de pedidos
* Baixa automática de estoque
* Cancelamento de pedidos
* Retorno automático ao estoque

---

# 📈 Melhorias Futuras

* Dashboard administrativo
* Relatórios PDF
* Upload de imagens
* Frontend React
* Deploy em produção
* Docker

---

# 👨‍💻 Autor

## Leonardo Silva Pinheiro

Projeto acadêmico desenvolvido para estudo de:

* Backend
* APIs REST
* Django
* PostgreSQL
* Arquitetura de sistemas

---

# 📄 Licença

Projeto destinado para fins acadêmicos e de aprendizado.
