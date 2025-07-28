import { Company } from "src/companies/companies.entity";
import { Employee } from "src/employees/employees.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('work_sessions')
export class Work_session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  session_date: Date;

  @Column()
  clock_in: Date;

  @Column()
  clock_out: Date;

  @Column()
  total_minutes: number;

  @Column()
  late_minutes: number;

  @Column()
  break_minutes: number;

  @Column()
  is_auto_generated: boolean;

  @CreateDateColumn()
  created_at: Date;
}