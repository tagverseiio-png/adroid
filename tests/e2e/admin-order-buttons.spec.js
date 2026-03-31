import { test, expect } from '@playwright/test';

test('admin order buttons smoke flow', async ({ page }) => {
  const orders = [
    {
      id: 11,
      order_number: 'ORD-1001',
      customer_name: 'Smoke Buyer',
      customer_email: 'smoke@example.com',
      customer_phone: '9999999999',
      subtotal: 3000,
      discount_amount: 0,
      shipping_charge: 0,
      total: 3000,
      payment_status: 'paid',
      order_status: 'placed',
      shiprocket_order_id: null,
      awb_code: null,
      courier_name: null,
      created_at: '2026-03-30T12:00:00.000Z',
      items: [
        {
          name: 'Chair Alpha',
          qty: 1,
          unit_price: 3000,
          total_price: 3000,
        },
      ],
      shipping_address: {
        line1: '10 Main St',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600001',
      },
    },
  ];

  const calls = {
    getAll: 0,
    updateStatus: 0,
    createShipment: 0,
  };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    if (url.endsWith('/api/auth/login') && method === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            token: 'smoke-token',
            user: { id: 1, username: 'adroitadmin', role: 'admin' },
          },
        }),
      });
      return;
    }

    if (url.includes('/api/shop/orders/admin/all') && method === 'GET') {
      calls.getAll += 1;
      const parsedUrl = new URL(url);
      const search = (parsedUrl.searchParams.get('search') || '').toLowerCase();
      const status = parsedUrl.searchParams.get('status') || '';

      const filtered = orders.filter((order) => {
        const searchMatch =
          !search ||
          order.order_number.toLowerCase().includes(search) ||
          order.customer_name.toLowerCase().includes(search) ||
          order.customer_email.toLowerCase().includes(search);
        const statusMatch = !status || order.order_status === status;
        return searchMatch && statusMatch;
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: filtered,
          total: filtered.length,
          revenue: filtered.reduce((sum, order) => sum + Number(order.total || 0), 0),
        }),
      });
      return;
    }

    if (/\/api\/shop\/orders\/\d+\/status$/.test(url) && method === 'PATCH') {
      calls.updateStatus += 1;
      const orderId = Number(url.match(/orders\/(\d+)\/status/)?.[1]);
      const payload = JSON.parse(request.postData() || '{}');
      const target = orders.find((order) => order.id === orderId);
      if (target && payload.status) {
        target.order_status = payload.status;
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: target || null }),
      });
      return;
    }

    if (/\/api\/shop\/orders\/\d+\/create-shipment$/.test(url) && method === 'POST') {
      calls.createShipment += 1;
      const orderId = Number(url.match(/orders\/(\d+)\/create-shipment/)?.[1]);
      const target = orders.find((order) => order.id === orderId);
      if (target) {
        target.shiprocket_order_id = `SR-${orderId}`;
        target.awb_code = 'AWB123456';
        target.courier_name = 'Delhivery';
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: target || null }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/?mode=admin');

  await page.getByPlaceholder('Username').fill('adroitadmin');
  await page.getByPlaceholder('Password').fill('adroit1');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('button', { name: 'Orders' }).click();
  await expect(page.getByRole('heading', { name: 'Orders' })).toBeVisible();

  await page.getByPlaceholder('Search by order #, name, email...').fill('ORD-1001');
  await expect(page.locator('tbody tr', { hasText: 'ORD-1001' })).toBeVisible();

  const row = page.locator('tbody tr', { hasText: 'ORD-1001' });
  await row.locator('select').selectOption('processing');
  await expect.poll(() => calls.updateStatus).toBe(1);

  await row.locator('button').first().click();
  await expect(page.getByRole('heading', { name: 'Order Detail' })).toBeVisible();
  await page.locator('//div[contains(@class,"fixed") and contains(@class,"inset-0")]//button').first().click();
  await expect(page.getByRole('heading', { name: 'Order Detail' })).toHaveCount(0);

  page.once('dialog', async (dialog) => {
    await dialog.accept();
  });
  await row.locator('button').nth(1).click();
  await expect.poll(() => calls.createShipment).toBe(1);

  await expect.poll(() => orders[0].shiprocket_order_id).toBe('SR-11');
});
