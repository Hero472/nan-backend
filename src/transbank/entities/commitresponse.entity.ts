import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { CardDetails } from './carddetails.entity';

@Entity()
export class CommitResponse {
  @Column()
  vci!: string;
  @Column()
  amount!: number;
  @Column()
  status!: string;
  @PrimaryColumn()
  buy_order!: string;
  @Column({ length: 61 })
  session_id!: string;
  @ManyToOne(() => CardDetails, (CardDetails) => CardDetails.card_number, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  card_detail!: CardDetails;
  @Column()
  accounting_date!: string;
  @Column()
  transaction_date!: string;
  @Column()
  authorization_code!: string;
  @Column()
  payment_type_code!: string;
  @Column()
  response_code!: number;
  @Column({ nullable: true })
  installments_amount!: number;
  @Column()
  installments_number!: number;
  @Column({ nullable: true })
  balance!: number;
}
