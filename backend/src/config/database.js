const { Pool } = require('pg');

// Optimized for 2GB RAM VM
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'adroit_design',
  user: process.env.DB_USER || 'adroit_user',
  password: process.env.DB_PASSWORD,
  // Connection pool settings (optimized for 2GB RAM)
  max: 5, // Maximum connections (reduced for 2GB RAM + remote DB)
  min: 0,  // Avoid holding idle connections to remote DB
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 20000,
  statement_timeout: 20000,
  query_timeout: 20000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

// Query helper with error logging
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, text);
    }
    return res;
  } catch (error) {
    const message = error?.message || '';
    const code = error?.code || '';
    const isTransient =
      message.includes('Connection terminated') ||
      message.includes('terminat') ||
      message.includes('ECONNRESET') ||
      message.includes('timeout') ||
      code === 'ETIMEDOUT' ||
      code === 'EADDRNOTAVAIL' ||
      code === 'ECONNREFUSED' ||
      code === 'EPIPE';

    if (isTransient) {
      console.warn('⚠️  Transient DB error, retrying once:', message);
      await new Promise((resolve) => setTimeout(resolve, 250));
      const client = await pool.connect();
      try {
        return await client.query(text, params);
      } finally {
        client.release();
      }
    }

    console.error('Database query error:', message);
    throw error;
  }
};

module.exports = {
  pool,
  query
};
