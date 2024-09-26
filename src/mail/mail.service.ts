import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    // Initialize Nodemailer transporter with SMTP settings (using Gmail as an example)
    this.transporter = nodemailer.createTransport({
      service: 'outlook', // Can be 'smtp.ethereal.email', 'outlook', etc.
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: '"Your Name" <your-email@gmail.com>', // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}