import { Company } from "src/companies/companies.entity";
import { Department } from "src/department/department.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserPermissions } from "./permissions.enum";
import { Shift } from "src/shifts/shifts.entity";
import * as bcrypt from "bcrypt"
import { Exclude, Expose } from "class-transformer";

export enum UserRole {
    SUPER_ADMIN = 'super_admin',
    COMPANY_ADMIN = 'company_admin',
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

    @Exclude()
    @Column()
    hashed_password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.EMPLOYEE
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

    // @Column({ nullable: true })
    // resetToken?: string | null

    // @Column({ type: 'timestamp', nullable: true })
    // resetTokenExpires?: Date | null

    @ManyToOne(() => Company, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'company_id' })
    company: Company;

    @ManyToOne(() => Department, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'department_id' })
    department: Department | null;

    @ManyToOne(() => Shift, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'shift_id' })
    shift: Shift | null;

    @CreateDateColumn()
    created_at: Date;

    @Column('enum', { enum: UserPermissions, array: true, default: ['view_user'] })
    permissions: UserPermissions[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.hashed_password && !this.hashed_password.startsWith('$2b$')) {
            // only hash if it's not already hashed
            const salt = await bcrypt.genSalt(10);
            this.hashed_password = await bcrypt.hash(this.hashed_password, salt);
        }
    }

    @Expose()
    get fullName(): string {
        return `${this.first_name} ${this.last_name}`;
    }
}