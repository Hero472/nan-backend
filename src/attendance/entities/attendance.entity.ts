import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';



@Schema({ collection: 'attendance' })
export class Attendance extends Document {
  @Prop({ required: true })
  id_subject!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true, type: [Number] })
  students!: number[];
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);