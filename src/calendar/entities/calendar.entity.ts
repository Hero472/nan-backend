import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'calendar' })
export class Calendar extends Document {
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