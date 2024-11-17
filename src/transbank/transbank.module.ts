import { Module } from '@nestjs/common';
import { TransbankController } from './transbank.controller';
import { TransbankService } from './transbank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommitResponse } from './entities/commitresponse.entity';
import { CardDetails } from './entities/carddetails.entity';
import { Transaction } from './entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, CommitResponse, CardDetails]),
  ],
  controllers: [TransbankController],
  providers: [TransbankService],
})
export class TransbankModule {}
