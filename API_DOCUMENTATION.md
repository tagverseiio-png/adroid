# API Documentation - Adroit Design

The Adroit Design API is built on Express.js and provides endpoints for a variety of tasks, including authentication, blog management, project portfolio management, shop operations, and Odoo recruitment integration.

## Authentication Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Register a new user. |
| `/api/auth/login` | POST | Login and receive a JWT token. |
| `/api/auth/logout` | POST | Logout and invalidate the session. |
| `/api/auth/token` | POST | Refresh an existing JWT token. |

---

## Blog Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/blog` | GET | List all blog posts. |
| `/api/blog/:id` | GET | Retrieve a specific blog post. |
| `/api/blog` | POST | Create a new blog post. (Requires Admin authentication) |
| `/api/blog/:id` | PUT | Update an existing blog post. (Requires Admin authentication) |
| `/api/blog/:id` | DELETE | Delete an existing blog post. (Requires Admin authentication) |

---

## Project Portfolio Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/projects` | GET | List all showcased projects. |
| `/api/projects/:id` | GET | Retrieve specific project details. |
| `/api/projects` | POST | Create a new project entry. (Requires Admin authentication) |
| `/api/projects/:id` | PUT | Update an existing project entry. (Requires Admin authentication) |
| `/api/projects/:id` | DELETE | Delete an existing project entry. (Requires Admin authentication) |

---

## Inquiry & Contact Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/inquiries` | GET | List all contact form inquiries. (Requires Admin authentication) |
| `/api/inquiries` | POST | Submit a new contact form to the site. |
| `/api/inquiries/:id` | DELETE | Delete or archive an inquiry. (Requires Admin authentication) |

---

## Shop & E-commerce Endpoints

The shop endpoints are located under `/api/shop`.

| Endpoint | Method | Description |
|---|---|---|
| `/api/shop/products` | GET | List all products in the catalog. |
| `/api/shop/products/:id` | GET | Retrieve specific product details. |
| `/api/shop/categories` | GET | List all available shop categories. |
| `/api/shop/coupons/validate` | POST | Validate a discount coupon code. |
| `/api/shop/orders` | POST | Create a new shop order. |
| `/api/shop/orders/:id` | GET | Retrieve specific order tracking details. |
| `/api/shop/payu/hash` | POST | Generate a PayU payment hash for the checkout flow. |

---

## Odoo Integration Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/odoo/jobs` | GET | Fetch active job listings directly from Odoo. |
| `/api/odoo/apply` | POST | Submit a job application to the Odoo recruitment module. |

---

## Analytics Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/analytics` | GET | Retrieve basic site traffic and interaction stats. (Requires Admin authentication) |
| `/api/analytics/events` | POST | Track custom user interaction events. |
