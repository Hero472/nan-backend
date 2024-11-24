import { Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  sender: string;
  room: string;
  createdAt: Date;
}

export const MessageSchema = new Schema({
  content: { type: String, required: true },
  sender: { type: String, required: true },
  room: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});