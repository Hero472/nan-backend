import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { CommitResponse } from './commitresponse.entity';

@Entity()
export class Transaction {
  @PrimaryColumn()
  token!: string;
  @OneToOne(() => CommitResponse, { cascade: true })
  @JoinColumn()
  commitResponse!: CommitResponse;
}
