const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { pool } = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 Running database migrations...\n');

    const migrationFiles = fs
      .readdirSync(__dirname)
      .filter((file) => /^\d+_.*\.sql$/.test(file))
      .sort((a, b) => {
        const numA = parseInt(a.split('_')[0], 10);
        const numB = parseInt(b.split('_')[0], 10);
        return numA - numB;
      });

    if (migrationFiles.length === 0) {
      throw new Error('No SQL migration files found in migrations folder');
    }

    for (const file of migrationFiles) {
      const migrationFile = path.join(__dirname, file);
      const sql = fs.readFileSync(migrationFile, 'utf8');
      console.log(`⏳ Applying ${file}...`);
      await pool.query(sql);
      console.log(`✅ Applied ${file}`);
    }

    console.log('✅ Migrations completed successfully!\n');
    console.log(`📦 Applied ${migrationFiles.length} migration file(s)`);
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
