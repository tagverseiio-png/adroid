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
