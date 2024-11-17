import { Body, Controller, Post } from '@nestjs/common';
import { TransbankService } from './transbank.service';

@Controller('transbank')
export class TransbankController {
  constructor(private readonly transbankService: TransbankService) {}

  @Post('echo')
  async echo(@Body() payload: any) {
    return await this.transbankService.echo(payload);
  }

  @Post('create-transaction')
  async createTransaction(@Body() payload: any) {
    console.log('[CREATE_TRANSACTION] payload: ', payload);
    return this.transbankService.createTransaction(payload);
  }

  @Post('commit-transaction')
  async commitTransaction(@Body() payload: any) {
    return this.transbankService.commitTransaction(payload);
  }

  @Post('transaction-status')
  async getTransactionStatus(@Body() payload: any) {
    const token = payload.token;
    return this.transbankService.statusTransaction(token);
  }

  @Post('refund-transaction')
  async refundTransaction(@Body() payload: any) {
    const { token, amount } = payload;
    return this.transbankService.refundTransaction(token, amount);
  }

  @Post('get-transaction')
  async getTransaction(@Body() payload: any) {
    const token = payload.token;
    return this.transbankService.getTransactionbyToken(token);
  }
}