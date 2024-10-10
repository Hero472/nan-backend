
import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.createPayment(createPaymentDto);
  }

  @Get()
  findAllPayments() {
    return this.paymentService.findAllPayments();
  }

  @Get('user/:userId')
  findPaymentsByUser(@Param('userId') userId: number) {
    return this.paymentService.findPaymentsByUser(userId);
  }

  @Get('report')
  generateFinancialReport() {
    return this.paymentService.generateFinancialReport();
  }
}
