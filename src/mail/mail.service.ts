import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    // Initialize Nodemailer transporter with SMTP settings (using outlook as an example)
    this.transporter = nodemailer.createTransport({
      service: 'outlook', // Can be 'smtp.ethereal.email', 'outlook', etc.
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: '"Your Name" <your-email@outlook.com>', // Sender address
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new InternalServerErrorException(`An error ocurred while sending an email ${error}`)
    }
  }

  async sendRecoveryEmail(to: string, recoveryCode: string) {
    const subject = 'Password Recovery';
    const text = `Your recovery code is: ${recoveryCode}`;
    const html = `<p>Your recovery code is: <b>${recoveryCode}</b></p>`;
    await this.sendMail(to, subject, text, html);
  }

}