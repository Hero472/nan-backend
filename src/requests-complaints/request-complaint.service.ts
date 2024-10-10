
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestComplaint } from './entities/request-complaint.entity';
import { CreateRequestComplaintDto } from './dto/create-request-complaint.dto';

@Injectable()
export class RequestComplaintService {
  constructor(
    @InjectRepository(RequestComplaint)
    private requestComplaintRepository: Repository<RequestComplaint>,
  ) {}

  async createRequestComplaint(createRequestComplaintDto: CreateRequestComplaintDto) {
    const requestComplaint = this.requestComplaintRepository.create(createRequestComplaintDto);
    return this.requestComplaintRepository.save(requestComplaint);
  }

  findAll() {
    return this.requestComplaintRepository.find({ relations: ['parent'] });
  }

  findOne(id: number) {
    return this.requestComplaintRepository.findOne(id, { relations: ['parent'] });
  }

  updateStatus(id: number, status: string) {
    return this.requestComplaintRepository.update(id, { status });
  }
}
