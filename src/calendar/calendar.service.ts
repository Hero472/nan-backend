
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async createEvent(createEventDto: CreateEventDto) {
    const event = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(event);
  }

  findAllEvents() {
    return this.eventRepository.find();
  }

  findEventById(id: number) {
    return this.eventRepository.findOne(id);
  }

  updateEvent(id: number, updateEventDto: any) {
    return this.eventRepository.update(id, updateEventDto);
  }

  deleteEvent(id: number) {
    return this.eventRepository.delete(id);
  }
}
