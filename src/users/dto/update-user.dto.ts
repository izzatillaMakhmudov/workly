import { IsInt, IsOptional, MinLength } from "class-validator";
import { CreateUserDto } from "./create-user.dto";
import { PartialType } from '@nestjs/mapped-types';


export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsOptional()
    @MinLength(8)
    password?: string;

    @IsOptional()
    @IsInt()
    company_id?: number;
}