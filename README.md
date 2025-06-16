# RBAC Fastify API

Esta API demonstra um controle de acesso baseado em papeis (RBAC) usando Fastify e PostgreSQL.

## Requisitos

- Node.js 20+
- PostgreSQL

## Instalação

1. Copie o arquivo `db.sql` para o seu banco de dados e execute para criar as tabelas.
2. Defina a variável de ambiente `DATABASE_URL` com a conexão do Postgres.
3. Instale as dependências:

```bash
npm install
```

4. Inicie o servidor:

```bash
npm start
```

A API ficará disponível em `http://localhost:3000`.

## Uso

Envie o cabeçalho `user-id` com o id do usuário autenticado para que as permissões sejam avaliadas. A rota `/admin` exige que o usuário tenha o papel `admin` e a rota `/profile` exige o papel `user`.
