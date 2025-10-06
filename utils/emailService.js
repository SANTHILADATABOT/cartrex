const nodemailer = require('nodemailer');
const sendgridMail = require('@sendgrid/mail');
const EmailTemplate = require('../models/EmailTemplate');

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.useSendGrid = true;
    } else {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      this.useSendGrid = false;
    }
  }

  async sendEmail(to, subject, html) {
    try {
      if (this.useSendGrid) {
        await sendgridMail.send({
          to,
          from: process.env.FROM_EMAIL,
          subject,
          html
        });
      } else {
        await this.transporter.sendMail({
          from: process.env.FROM_EMAIL,
          to,
          subject,
          html
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  async sendTemplateEmail(to, templateCategory, variables = {}) {
    try {
      const template = await EmailTemplate.findOne({ 
        category: templateCategory,
        isActive: true 
      });

      if (!template) {
        throw new Error(`Template not found for category: ${templateCategory}`);
      }

      let content = template.content;
      let subject = template.subject;

      // Replace variables in template
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, variables[key]);
        subject = subject.replace(regex, variables[key]);
      });

      return await this.sendEmail(to, subject, content);
    } catch (error) {
      console.error('Send template email error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();