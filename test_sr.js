require('dotenv').config({ path: './backend/.env' });
const { pool } = require('./backend/src/config/database');
const { createShipment } = require('./backend/src/controllers/shop/shiprocketController');

async function test() {
    try {
        const orderRes = await pool.query(`SELECT * FROM shop_orders ORDER BY id DESC LIMIT 1`);
        if (orderRes.rows.length === 0) {
            console.log('No orders found');
            process.exit(0);
        }
        const order = orderRes.rows[0];
        console.log('Testing with order:', order.order_number);
        
        // Mock it as paid so we can test shipment logic if needed, but createShipment doesn't check payment_status itself (it just sends 'Prepaid' or 'COD')
        const result = await createShipment(order);
        console.log('Success:', result);
    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        pool.end();
    }
}
test();
