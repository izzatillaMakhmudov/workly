import { IsEmail, IsEnum, IsInt, IsNumber, IsOptional, MinLength } from "class-validator";
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
    @MinLength(8)
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole

    @IsEnum(UserGender)
    @IsOptional()
    gender?: UserGender

    @IsNumber()
    pinfl: number;

    @IsInt()
    company_id?: number;

    @IsOptional()
    @IsInt()
    department_id?: number;

    @IsOptional()
    @IsInt()
    shift_id?: number;

}