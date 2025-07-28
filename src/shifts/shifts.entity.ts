import { Company } from "src/companies/companies.entity";
import { Employee } from "src/employees/employees.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column()
  shift_name: string;

  @Column()
  start_time: string;

  @Column()
  end_time: string;

  @Column()
  break_start: string;

  @Column()
  break_end: string;

  @CreateDateColumn()
  created_at: Date;
}