import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Attendance } from './entities/attendance.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationService } from 'src/notifications/notification.service';
import { SubjectService } from 'src/subject/subject.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance.name) private readonly attendanceModel: Model<Attendance>,
    private readonly notificationService: NotificationService,
    private readonly subjectService: SubjectService,

  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    const attendance = new this.attendanceModel({
      id_subject: createAttendanceDto.id_subject,
      date: createAttendanceDto.date,
      level: createAttendanceDto.level,
      students: createAttendanceDto.studentIds,
    });

    const students = await this.subjectService.getStudentSubjectIdSubject(attendance.id_subject);
    console.log("estudiantes",students);
    const notPresentStudents = students.filter(student => !attendance.students.includes(student.id_student));
    console.log("no presentes",notPresentStudents);

    const formattedDate = new Date(attendance.date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    await this.notificationService.enviarNotificacionGlobal(
      'Nueva Asistencia',
      `Nueva asistencia para la materia ${attendance.id_subject} el día ${formattedDate}.`,
    );

    const notPresentStudentIds = notPresentStudents.map(student => student.id_student.toString());
    await this.notificationService.sendNotification('inasisitencia', 'Usted no asistió a la clase', notPresentStudentIds);

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

  async getAttendanceStudent(id: number): Promise<Attendance[]> {
    try {

      const attendanceRecords = await this.attendanceModel.find({ students: id }).exec();

      if (attendanceRecords.length === 0) {
        throw new NotFoundException(`No attendance records found for student with ID ${id}`);
      }

      return attendanceRecords;

    } catch (error: unknown) {
      throw new InternalServerErrorException(`Failed to fetch attendance for student: ${error}`);
    }
  }

  async getAttendancePercentageForSubject(id_subject: number): Promise<number> {
    const attendanceRecords = await this.attendanceModel.find({ id_subject }).exec();

    if (attendanceRecords.length === 0) {
      return 0;
    }

    const totalSessions = attendanceRecords.length;

    let totalAttendanceCount = 0;
    attendanceRecords.forEach((record) => {
      totalAttendanceCount += record.students.length;
    });

    // Calculate the total number of students who could have attended (total students × total sessions)
    const totalStudents = new Set(attendanceRecords.flatMap(record => record.students)).size;
    const totalPossibleAttendance = totalStudents * totalSessions;

    // Calculate the attendance percentage
    const attendancePercentage = (totalAttendanceCount / totalPossibleAttendance) * 100;

    return attendancePercentage;
  }

  async getAttendanceForStudentInSubject(id_subject: number, id_student: number): Promise<number> {
    // Fetch all attendance records for the given subject
    const attendanceRecords = await this.attendanceModel.find({ id_subject }).exec();

    if (attendanceRecords.length === 0) {
      return 0;
    }

    // Calculate the total sessions attended by the student
    let totalAttendanceCount = 0;
    attendanceRecords.forEach((record) => {
      if (record.students.includes(id_student)) {
        totalAttendanceCount += 1;
      }
    });

    // Calculate the total number of sessions
    const totalSessions = attendanceRecords.length;

    // Calculate the attendance percentage
    const attendancePercentage = (totalAttendanceCount / totalSessions) * 100;

    return attendancePercentage;
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
