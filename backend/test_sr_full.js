require('dotenv').config({ path: './.env' });
const { getToken, createShipment, cancelShipment } = require('./src/controllers/shop/shiprocketController');

async function runTest() {
    console.log('1. Connecting to Shiprocket to get Token...');
    try {
        const token = await getToken();
        console.log('✅ Token received:', token.substring(0, 20) + '...');
    } catch (e) {
        console.error('❌ Failed to get token:', e.message);
        process.exit(1);
    }

    console.log('\n2. Creating dummy order payload...');
    const dummyOrder = {
        order_number: 'TEST-' + Date.now(),
        created_at: new Date().toISOString(),
        pickup_location_name: 'Primary',
        notes: 'Test order from terminal',
        customer_name: 'Test Adroit',
        customer_email: 'test@adroitdesigns.in',
        customer_phone: '9876543210',
        shipping_address: {
            line1: '8/31 bharathiyar street, Teynampet',
            line2: '',
            city: 'Chennai',
            state: 'Tamil Nadu',
            pincode: '600018'
        },
        items: [
            { name: 'Test Product', sku: 'TEST-SKU-1', qty: 1, unit_price: 100 }
        ],
        payment_status: 'paid',
        shipping_charge: 0,
        discount_amount: 0,
        subtotal: 100
    };

    console.log('\n3. Pushing order to Shiprocket...');
    let shiprocketRes;
    try {
        shiprocketRes = await createShipment(dummyOrder);
        console.log('✅ Order created in Shiprocket!');
        console.log(shiprocketRes);
    } catch (e) {
        console.error('❌ Failed to create order:', e.message);
        process.exit(1);
    }

    if (shiprocketRes.awb_code) {
        console.log('\n4. Cancelling Shipment via AWB...');
        try {
            const cancelRes = await cancelShipment([shiprocketRes.awb_code]);
            console.log('✅ Shipment Cancelled:', cancelRes);
        } catch (e) {
            console.error('❌ Failed to cancel shipment:', e.message);
        }
    } else {
        console.log('\n⚠️ No AWB code generated (order is in Shiprocket, but courier assignment pending). Cannot cancel via AWB. You may need to cancel it manually in the Shiprocket dashboard.');
    }
}

runTest();
