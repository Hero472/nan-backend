import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() to: string, subject: string, text: string, html?: string ) {
    await this.mailService.sendMail(to, subject, text, html);
    return { message: 'Email sent successfully' };
  }

  @Post('recovery-password')
  async recoverPassword(@Body() to: string, recoveryCode: string) {
    await this.mailService.sendRecoveryEmail(to, recoveryCode)
    return { message: 'Recover password email sent successfully' }
  }

}