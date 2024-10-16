import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    // Initialize Nodemailer transporter with SMTP settings (using outlook as an example)
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('APP_PASSWORD'),
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {

    if (!to || !subject || !text) {
      throw new BadRequestException('Missing required email parameters (to, subject, or text)');
    }

    if (!isValidEmail(to)) {
      throw new BadRequestException('Invalid email format');
    }

    const mailOptions = {
      from: `"Colegio" <${this.configService.get<string>('EMAIL')}>`,
      to,
      subject, 
      text,
      html,
    };

    console.log('Sending email to:', to);

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error: unknown) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(`An error occurred while sending an email`);
    }
  }

  async sendRecoveryEmail(to: string, recoveryCode: string) {
    if (!isValidEmail(to)) {
      throw new BadRequestException('Invalid email format');
    }
    const subject = 'Password Recovery';
    const text = `Your recovery code is: ${recoveryCode}`;
    const html = `<p>Your recovery code is: <b>${recoveryCode}</b></p>`;
    await this.sendMail(to, subject, text, html);
  }

}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}