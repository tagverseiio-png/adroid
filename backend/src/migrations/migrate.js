const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');
require('dotenv').config();

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...\n');

    const migrationFile = path.join(__dirname, '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    await pool.query(sql);

    console.log('✅ Migrations completed successfully!\n');
    console.log('📊 Database schema created');
    console.log('👤 Default admin user created');
    console.log('   Username: adroitadmin');
    console.log('   Password: adroit1\n');
    console.log('⚠️  Please change the default password after first login!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runMigrations();
