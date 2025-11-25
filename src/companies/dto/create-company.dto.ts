import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UserRole } from "src/users/user.entity";
import { Industry } from "../companies.entity";
import { Column } from "typeorm";

export class CreateCompanyDto extends PartialType(CreateUserDto) {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(Industry)
    industry: Industry;

    @IsString()
    @IsNotEmpty()
    address: string;

    @IsNumber()
    @IsNotEmpty()
    @Column({
        unique: true,
        nullable: false
    })
    stir: number;

    @IsOptional()
    role?: UserRole = UserRole.COMPANY_ADMIN



}