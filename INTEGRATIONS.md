# Integrations - Adroit Design

Adroit Design uses several external services to streamline business operations and customer interaction.

## Odoo Recruitment Integration

The website is integrated with the Odoo recruitment module to manage job listings and candidate applications.

### Configuration
Update the following environment variables in the `backend/.env` file:
- `ODOO_URL`: The URL of your Odoo instance.
- `ODOO_DATABASE`: The name of the database.
- `ODOO_USERNAME`: The username of the user with recruitment permissions.
- `ODOO_PASSWORD`: The password of the user.
- `ODOO_API_KEY`: Set to `true` if you use an API key.

### Core Functions
- **Fetch Jobs**: Fetches all active job postings from the Odoo `hr.job` model.
- **Submit Application**: Submits forms from the careers page to the Odoo `hr.applicant` model, including CV/resume file uploads.

---

## PayU Payment Gateway

The project uses PayU for handling secure online transactions in the e-commerce shop.

### Configuration
Update the following in the `backend/.env` file:
- `PAYU_KEY`: Your PayU Merchant Key.
- `PAYU_SALT`: Your PayU Salt for hash generation.
- `PAYU_BASE_URL`: The URL for PayU transactions (Sandbox or Production).

### Core Functions
- **Hash Generation**: Securely calculates the SHA-512 hash required for PayU transactions.
- **Status Verification**: Checks the status of a transaction through the PayU API.
- **Webhooks**: Handles asynchronous payment notification from PayU.

---

## Shiprocket Delivery Partner

Shiprocket is used to automate the delivery and tracking of orders from the shop.

### Configuration
Update the following in the `backend/.env` file:
- `SHIPROCKET_EMAIL`: Your Shiprocket account email.
- `SHIPROCKET_PASSWORD`: Your Shiprocket account password.

### Core Functions
- **Shipment Creation**: Automatically creates a shipment in Shiprocket upon successful payment.
- **AWB Generation**: Generates Air Waybill (AWB) numbers for tracking.
- **Track Order**: Fetches real-time shipment status from Shiprocket.

---

## AI Chatbot Integration

The website features an AI chatbot for customer support and interaction.

### Configuration
Update the following in the `.env` file:
- `VITE_CHATBOT_URL`: The URL for the chatbot's streaming API.

---

## Mailing (Nodemailer)

The backend uses Nodemailer to send automated email notifications for contact inquiries and order confirmations.

### Configuration
The SMTP configuration should be updated in the `backend/src/config/mail.js` file or using environment variables.
