import { test, expect } from '@playwright/test';

test('admin product buttons smoke flow', async ({ page }) => {
  const categories = [{ id: 1, name: 'Living Room' }];
  const products = [
    {
      id: 1,
      name: 'Initial Product',
      sku: 'SKU-INIT-1',
      category_id: 1,
      category_name: 'Living Room',
      short_description: 'Initial short description',
      description: 'Initial description',
      price: 1999,
      sale_price: null,
      stock_qty: 4,
      weight_grams: 500,
      cover_image: '',
      images: [],
      tags: ['initial'],
      published: false,
      featured: false,
    },
  ];

  let idCounter = 2;
  const calls = {
    create: 0,
    update: 0,
    publish: 0,
    featured: 0,
    delete: 0,
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

    if (url.includes('/api/shop/categories') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: categories }),
      });
      return;
    }

    if (url.includes('/api/shop/products/admin/all') && method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: products }),
      });
      return;
    }

    if (url.endsWith('/api/shop/products') && method === 'POST') {
      calls.create += 1;
      const payload = JSON.parse(request.postData() || '{}');
      products.unshift({
        id: idCounter++,
        category_name: categories.find((c) => String(c.id) === String(payload.category_id))?.name || null,
        ...payload,
      });

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: products[0] }),
      });
      return;
    }

    if (/\/api\/shop\/products\/\d+$/.test(url) && method === 'PUT') {
      calls.update += 1;
      const id = Number(url.match(/(\d+)$/)?.[1]);
      const payload = JSON.parse(request.postData() || '{}');
      const target = products.find((p) => p.id === id);
      if (target) Object.assign(target, payload);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: target || null }),
      });
      return;
    }

    if (/\/api\/shop\/products\/\d+\/publish$/.test(url) && method === 'PATCH') {
      calls.publish += 1;
      const id = Number(url.match(/products\/(\d+)\/publish/)?.[1]);
      const target = products.find((p) => p.id === id);
      if (target) target.published = !target.published;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: target || null }),
      });
      return;
    }

    if (/\/api\/shop\/products\/\d+\/featured$/.test(url) && method === 'PATCH') {
      calls.featured += 1;
      const id = Number(url.match(/products\/(\d+)\/featured/)?.[1]);
      const target = products.find((p) => p.id === id);
      if (target) target.featured = !target.featured;

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: target || null }),
      });
      return;
    }

    if (/\/api\/shop\/products\/\d+$/.test(url) && method === 'DELETE') {
      calls.delete += 1;
      const id = Number(url.match(/(\d+)$/)?.[1]);
      const idx = products.findIndex((p) => p.id === id);
      if (idx >= 0) products.splice(idx, 1);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
      return;
    }

    await route.fallback();
  });

  await page.goto('/?mode=admin');

  await page.getByPlaceholder('Username').fill('adroitadmin');
  await page.getByPlaceholder('Password').fill('adroit1');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
  await page.getByRole('button', { name: 'Products' }).click();

  await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible();

  await page.getByRole('button', { name: 'Add Product' }).click();
  await page.locator('label:has-text("Name *") + input').fill('Smoke Product');
  await page.locator('label:has-text("Price (₹) *") + input').fill('2999');
  await page.locator('label:has-text("Stock Qty") + input').fill('2');
  await page.getByRole('button', { name: 'Save Product' }).click();

  await expect.poll(() => calls.create).toBe(1);
  const smokeRow = page.locator('tbody tr', { hasText: 'Smoke Product' });
  await expect(smokeRow).toBeVisible();

  await smokeRow.getByTitle('Publish').click();
  await expect.poll(() => calls.publish).toBe(1);

  await smokeRow.getByTitle('Toggle Featured').click();
  await expect.poll(() => calls.featured).toBe(1);

  await smokeRow.locator('button').nth(2).click();
  await page.locator('label:has-text("Short Description") + input').fill('Updated from smoke test');
  await page.getByRole('button', { name: 'Save Product' }).click();
  await expect.poll(() => calls.update).toBe(1);

  page.once('dialog', (dialog) => dialog.accept());
  await smokeRow.locator('button').nth(3).click();
  await expect.poll(() => calls.delete).toBe(1);
  await expect(page.locator('tbody tr', { hasText: 'Smoke Product' })).toHaveCount(0);
});
