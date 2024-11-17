import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CardDetails {
  @PrimaryColumn()
  card_number!: string;
}
