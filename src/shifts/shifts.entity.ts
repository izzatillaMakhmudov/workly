import { Matches } from "class-validator";
import { Company } from "src/companies/companies.entity";
import { Users } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('shifts')
export class Shift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  start_time: string;

  @Column()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  end_time: string;

  @Column()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  break_start: string;

  @Column()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
  break_end: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Users, user => user.shift, { onDelete: 'SET NULL' })
  users: Users[];

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}