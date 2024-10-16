import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { CreateMailDto } from './dto/create-mail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(@Body() sendMail : CreateMailDto) {
    await this.mailService.sendMail(sendMail.to, sendMail.subject,  sendMail.text,  sendMail.html);
    return { message: 'Email sent successfully' };
  }

  @Post('recovery-password')
  async recoverPassword(@Body() to: string, recoveryCode: string) {
    await this.mailService.sendRecoveryEmail(to, recoveryCode)
    return { message: 'Recover password email sent successfully' }
  }

}