
import { Company } from "src/companies/companies.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('terminals')
export class Terminal {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  ip_address: string;

  @Column()
  serial_number: string;

  @CreateDateColumn()
  created_at: Date;
}