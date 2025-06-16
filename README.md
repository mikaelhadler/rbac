# Fastify RBAC Boilerplate

This project demonstrates a REST API built with Fastify, JWT authentication and Role-Based Access Control using PostgreSQL via Prisma.

## Requirements

- Node.js 20+
- Docker (for PostgreSQL via `docker-compose`)

## Setup

1. Copy `.env` and adjust `DATABASE_URL` and `JWT_SECRET` as needed.
2. Start PostgreSQL:

```bash
docker-compose up -d
```

3. Install dependencies and generate Prisma client:

```bash
npm install
npx prisma migrate deploy
npm run seed
```

4. Start the API:

```bash
npm start
```

The server will be available at `http://localhost:3000`.

## Project Structure

- `prisma/schema.prisma` – data model and migrations
- `src/plugins/` – authentication, permissions and Prisma plugins
- `src/routes/` – route handlers (auth, users, residents, complaints)

## Seeding

The seed script creates the roles and permissions and inserts one user for each role (admin, manager and resident) with password `secret`.

## Testing

Run tests with:

```bash
npm test
```
