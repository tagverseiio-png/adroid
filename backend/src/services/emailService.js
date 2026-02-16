const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Initialize transporter - only if email config is provided
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || 587),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: process.env.EMAIL_USER ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        } : undefined
      });
    } else {
      // Mock transporter if no email config
      this.transporter = null;
      console.warn('⚠️  Email service disabled - EMAIL credentials not configured');
    }
  }

  /**
   * Send inquiry notification
   */
  async sendInquiryNotification(inquiry) {
    try {
      // Skip if email not configured
      if (!this.transporter) {
        console.log('📧 Email disabled - inquiry received:', inquiry.email);
        return true;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.EMAIL_USER,
        subject: `New Inquiry: ${inquiry.subject || 'Contact Form'}`,
        html: `
          <h2>New Inquiry Received</h2>
          <p><strong>Name:</strong> ${inquiry.name}</p>
          <p><strong>Email:</strong> ${inquiry.email}</p>
          <p><strong>Phone:</strong> ${inquiry.phone || 'N/A'}</p>
          <p><strong>Type:</strong> ${inquiry.type || 'enquiry'}</p>
          <p><strong>Subject:</strong> ${inquiry.subject || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${inquiry.message}</p>
          <hr>
          <p><small>Received: ${new Date().toLocaleString()}</small></p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send auto-reply to inquiry submitter
   */
  async sendAutoReply(inquiry) {
    try {
      // Skip if email not configured
      if (!this.transporter) {
        console.log('📧 Email disabled - auto-reply skipped for:', inquiry.email);
        return true;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: inquiry.email,
        subject: 'Thank you for contacting Adroit Design',
        html: `
          <h2>Thank You for Your Inquiry</h2>
          <p>Dear ${inquiry.name},</p>
          <p>Thank you for contacting Adroit Design. We have received your inquiry and will get back to you shortly.</p>
          <p><strong>Your Message:</strong></p>
          <p>${inquiry.message}</p>
          <br>
          <p>Best regards,</p>
          <p><strong>Adroit Design India Pvt Ltd</strong></p>
          <p>No 8, MCN Nagar Extension, Thoraipakkam, Chennai - 97</p>
          <p>Phone: (+91) 44-45561113, (+91) 9940064343</p>
          <p>Email: info@adroitdesigns.in</p>
        `
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Auto-reply send error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
