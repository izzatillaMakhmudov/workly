import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { Industry } from "../companies.entity";

export class UpdateCompanyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEnum(Industry)
    industry: Industry;

    @IsString()
    @IsNotEmpty()
    address: string;
}