import { Company } from "src/companies/companies.entity";
import { Terminal } from "src/terminals/terminals.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attendance_logs')
export class Attendance_log {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Terminal, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'terminal_id' })
  terminal: Terminal;

  @Column()
  event_type: string;

  @Column()
  timestamp: Date;

  @Column()
  source: string;

  @CreateDateColumn()
  created_at: Date;
}