
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto) {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  findAllPayments() {
    return this.paymentRepository.find({ relations: ['user'] });
  }

  findPaymentsByUser(userId: number) {
    return this.paymentRepository.find({ where: { user: userId }, relations: ['user'] });
  }

  generateFinancialReport() {
    // Logic to generate a basic financial report
    return this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'totalRevenue')
      .addSelect('payment.status', 'status')
      .groupBy('payment.status')
      .getRawMany();
  }
}
