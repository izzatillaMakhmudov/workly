import { Company } from "src/companies/companies.entity";
import { Department } from "src/department/department.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPermissions } from "./permissions.enum";
import { Shift } from "src/shifts/shifts.entity";

export enum UserRole {
    ADMIN = 'admin',
    HR = 'hr',
    EMPLOYEE = 'employee',
    MANAGER = 'manager'
}

export enum UserGender {
    MALE = 'male',
    FEMALE = 'female',
    NOTSET = 'not set'
}

@Entity('users')
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
    })
    role: UserRole;

    @Column({
        nullable: true,
        type: 'enum',
        enum: UserGender
    })
    gender: UserGender;

    @Column({
        nullable: false,
        unique: true,
        type: 'bigint'  // Assuming PNFL is a large number, using bigint
    })
    pinfl: number

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'department_id' })
    department: Department;

    @ManyToOne(() => Shift, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'shift_id' })
    shift: Shift;

    @CreateDateColumn()
    created_at: Date;

    @Column('enum', { enum: UserPermissions, array: true, default: ['view_user'] })
    permissions: UserPermissions[];
}