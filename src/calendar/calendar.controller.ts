
import { Controller, Post, Get, Body, Param, Patch, Delete } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto } from './dto/create-event.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  createEvent(@Body() createEventDto: CreateEventDto) {
    return this.calendarService.createEvent(createEventDto);
  }

  @Get()
  findAllEvents() {
    return this.calendarService.findAllEvents();
  }

  @Get(':id')
  findEventById(@Param('id') id: number) {
    return this.calendarService.findEventById(id);
  }

  @Patch(':id')
  updateEvent(@Param('id') id: number, @Body() updateEventDto: any) {
    return this.calendarService.updateEvent(id, updateEventDto);
  }

  @Delete(':id')
  deleteEvent(@Param('id') id: number) {
    return this.calendarService.deleteEvent(id);
  }
}
