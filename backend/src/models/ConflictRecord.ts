import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ConflictRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['husband', 'wife'] })
  role: string;

  @Column('smallint')
  duration: number;

  @Column('tinyint')
  complaints: number;

  @Column({ type: 'enum', enum: ['duration', 'complaint', 'both'], nullable: true })
  conflictType?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
