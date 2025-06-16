import fp from 'fastify-plugin';
import pkg from 'pg';

const { Pool } = pkg;

async function dbPlugin(fastify) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  fastify.decorate('pg', pool);
  fastify.addHook('onClose', async () => {
    await pool.end();
  });
}

export default fp(dbPlugin);
