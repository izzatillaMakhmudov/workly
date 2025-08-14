import { IsEmail, IsNumber, IsOptional } from "class-validator";
import { Column } from "typeorm";
import { UserGender, UserRole } from "../user.entity";

export class CreateUserDto {

    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({
        unique: true,
        nullable: false
    })
    @IsEmail({})
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: 'employee'
    })
    role: UserRole;

    @Column({
        type: 'enum',
        enum: UserGender,
        default: 'not set'
    })
    gender: UserGender;

    @IsNumber()
    pinfl: number;

    @IsOptional()
    @IsNumber()
    department_id?: number;

    @IsOptional()
    @IsNumber()
    shift_id?: number;

}