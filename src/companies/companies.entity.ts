import { Department } from "src/department/department.entity";
import { Shift } from "src/shifts/shifts.entity";
import { Terminal } from "src/terminals/terminals.entity";
import { Users } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum Industry {
    TECHNOLOGY = 'Technology',
    FINANCE = 'Finance',
    HEALTHCARE = 'Healthcare',
    EDUCATION = 'Education',
    RETAIL = 'Retail',
    MANUFACTURING = 'Manufacturing',
    LOGISTICS = 'Logistics',
    OTHER = 'Other'
}

@Entity('companies')
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: Industry })
    industry: Industry;

    @OneToMany(() => Department, department => department.company)
    departments: Department[];

    @OneToMany(() => Shift, shift => shift.company)
    shifts: Shift[];

    @OneToMany(() => Terminal, terminal => terminal.company)
    terminals: Terminal[];

    @OneToMany(() => Users, user => user.company)
    users: Users[];

    @Column()
    address: string;

    @CreateDateColumn()
    created_at: Date;
}