
import { Controller, Post, Get, Body, Param, Patch } from '@nestjs/common';
import { RequestComplaintService } from './request-complaint.service';
import { CreateRequestComplaintDto } from './dto/create-request-complaint.dto';

@Controller('requests-complaints')
export class RequestComplaintController {
  constructor(private readonly requestComplaintService: RequestComplaintService) {}

  @Post()
  createRequestComplaint(@Body() createRequestComplaintDto: CreateRequestComplaintDto) {
    return this.requestComplaintService.createRequestComplaint(createRequestComplaintDto);
  }

  @Get()
  findAll() {
    return this.requestComplaintService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.requestComplaintService.findOne(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: number, @Body('status') status: string) {
    return this.requestComplaintService.updateStatus(id, status);
  }
}
