import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<Attendance>,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = new this.attendanceModel({
      id_subject: createAttendanceDto.id_subject,
      date: createAttendanceDto.date,
      students: createAttendanceDto.studentIds,
    });

    return attendance.save();
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceModel.find().exec();
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) {
      throw new NotFoundException(`Attendance record with id ${id} not found`);
    }
    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByIdAndUpdate(
      id,
      updateAttendanceDto,
      { new: true, runValidators: true },
    );

    if (!attendance) {
      throw new NotFoundException(`Attendance record with id ${id} not found`);
    }

    return attendance;
  }

  async remove(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByIdAndDelete(id).exec();
    if (!attendance) {
      throw new NotFoundException(`Attendance record with id ${id} not found`);
    }
    return attendance;
  }
}
