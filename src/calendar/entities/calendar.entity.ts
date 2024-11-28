import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'calendar' })
export class Calendar extends Document {
    @Prop({ type: Types.ObjectId })
    _id!: Types.ObjectId;

    @Prop({ required: true })
    title!: string;

    @Prop({ required: true })
    start!: Date;

    @Prop({ required: true })
    end!: Date;

    @Prop({ required: false })
    description?: string;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);