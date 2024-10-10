import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';

describe('MailService', () => {
  let service: MailService;
  let transporterMock: jest.Mocked<nodemailer.Transporter>;

  beforeEach(async () => {
    transporterMock = {
      sendMail: jest.fn().mockResolvedValue({ messageId: 'mockMessageId' }),
    } as any;

    jest.spyOn(nodemailer, 'createTransport').mockReturnValue(transporterMock);

    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should send an email successfully', async () => {
    await service.sendMail(
      'test@example.com',
      'Test Subject',
      'Test text body',
      '<p>Test HTML body</p>',
    );

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Your Name" <your-email@gmail.com>',
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test text body',
      html: '<p>Test HTML body</p>',
    });
  });

  it('should send a recovery email', async () => {
    const recoveryCode = '123456';
    await service.sendRecoveryEmail('test@example.com', recoveryCode);

    expect(transporterMock.sendMail).toHaveBeenCalledWith({
      from: '"Your Name" <your-email@gmail.com>',
      to: 'test@example.com',
      subject: 'Password Recovery',
      text: `Your recovery code is: ${recoveryCode}`,
      html: `<p>Your recovery code is: <b>${recoveryCode}</b></p>`,
    });
  });
});