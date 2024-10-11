import { MailService } from './mail.service';
import * as nodemailer from 'nodemailer';
import { InternalServerErrorException } from '@nestjs/common';

jest.mock('nodemailer');

describe('MailService', () => {
  let mailService: MailService;
  let sendMailMock: jest.Mock;

  beforeEach(() => {
    sendMailMock = jest.fn();

    (nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: sendMailMock,
    });

    mailService = new MailService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should send an email successfully', async () => {
      sendMailMock.mockResolvedValueOnce({});

      await mailService.sendMail('test@example.com', 'Test Subject', 'Test Text');

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Your Name" <your-email@outlook.com>',
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: undefined,
      });
    });

    it('should throw an error when sending fails', async () => {
      const errorMessage = 'Failed to send email';
      sendMailMock.mockRejectedValueOnce(new Error(errorMessage)); // Simulate failure

      await expect(
        mailService.sendMail('test@example.com', 'Test Subject', 'Test Text')
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('sendRecoveryEmail', () => {
    it('should send a recovery email', async () => {
      sendMailMock.mockResolvedValueOnce({}); // Mock successful sendMail response

      const recoveryCode = '123456';
      await mailService.sendRecoveryEmail('test@example.com', recoveryCode);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: '"Your Name" <your-email@outlook.com>',
        to: 'test@example.com',
        subject: 'Password Recovery',
        text: `Your recovery code is: ${recoveryCode}`,
        html: `<p>Your recovery code is: <b>${recoveryCode}</b></p>`,
      });
    });

    it('should throw an error when sending recovery email', async () => {
      const recoveryCode = '123456';
      const errorMessage = 'Failed to send email';
      sendMailMock.mockRejectedValueOnce(new Error(errorMessage));

      await expect(
        mailService.sendRecoveryEmail('test@example.com', recoveryCode)
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});