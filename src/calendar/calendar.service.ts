import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCalendarDto } from './dto/create-calendar.dto';
import { UpdateCalendarDto } from './dto/update-calendar.dto';
import { Calendar } from './entities/calendar.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name) private readonly calendarModel: Model<Calendar>,
  ) {}

  async create(createCalendarDto: CreateCalendarDto): Promise<Calendar> {
    
    const calendar = new this.calendarModel({
      title: createCalendarDto.title,
      start: createCalendarDto.start,
      end: createCalendarDto.end,
      description: createCalendarDto.description
    })

    return calendar.save()
  }

  async findAll(): Promise<Calendar[]> {
    return this.calendarModel.find().exec()
  }

  async update(id: number, updateCalendarDto: UpdateCalendarDto): Promise<Calendar> {
    const calendar = await this.calendarModel.findByIdAndUpdate(
      id,
      updateCalendarDto,
      { new: true, runValidators: true }
    );

    if (!calendar) {
      throw new NotFoundException(`Calendar record with id ${id} not found`);
    }

    return calendar
  }

  async remove(id: number): Promise<Calendar> {
    const calendar = await this.calendarModel.findByIdAndDelete(id).exec();
    if (!calendar) {
      throw new NotFoundException(`Calendar record with id ${id} not found`);
    }
    return calendar;
  }
}
