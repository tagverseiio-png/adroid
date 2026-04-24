const { pool } = require('./backend/src/config/database');
async function run() {
    try {
        const res = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'shop_products'`);
        console.log(res.rows);
    } catch(e) { console.error(e); } finally { pool.end(); }
}
run();
