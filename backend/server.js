require('dotenv').config();
const app = require('./src/app');
const { pool } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your database configuration in .env file');
  } else {
    console.log('✅ Database connected successfully');
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Adroit Backend Server Running`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: ${process.env.API_URL || `http://localhost:${PORT}`}`);
  console.log(`📡 Server listening on port ${PORT}`);
  console.log(`\n📚 API Documentation:`);
  console.log(`   - POST   ${process.env.API_URL}/api/auth/login`);
  console.log(`   - GET    ${process.env.API_URL}/api/projects`);
  console.log(`   - GET    ${process.env.API_URL}/api/blog`);
  console.log(`   - POST   ${process.env.API_URL}/api/inquiries\n`);

  // ── Keep-alive pinger ──────────────────────────────────────────────────────
  // Pings the HuggingFace chatbot Space every 5 minutes so it never goes cold.
  const CHATBOT_URL = process.env.CHATBOT_URL || 'https://dinely523-aidiot-proj.hf.space/chat/stream';

  const pingChatbot = () => {
    try {
      const url = new URL(CHATBOT_URL);
      const lib = url.protocol === 'https:' ? require('https') : require('http');
      const body = JSON.stringify({ query: 'hi' });

      const req = lib.request(
        {
          hostname: url.hostname, path: url.pathname + url.search, method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        },
        (res) => {
          res.resume(); // drain the response
          console.log(`🤖 Chatbot ping → ${res.statusCode} (${new Date().toLocaleTimeString()})`);
        }
      );
      req.on('error', (err) => console.warn('⚠️  Chatbot ping failed:', err.message));
      req.write(body);
      req.end();
    } catch (err) {
      console.warn('⚠️  Chatbot ping error:', err.message);
    }
  };

  // First ping immediately, then every 5 minutes
  pingChatbot();
  setInterval(pingChatbot, 5 * 60 * 1000);
  console.log(`🏓 Keep-alive pinger started → ${CHATBOT_URL} (every 5 min)\n`);
  // ──────────────────────────────────────────────────────────────────────────
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    pool.end(() => {
      console.log('Database pool closed');
      process.exit(0);
    });
  });
});
