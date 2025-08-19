import { IsInt } from "class-validator";
import { Column } from "typeorm";

export class CreateTerminalDto {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    serial_number: string

    @Column()
    location: string

    @IsInt()
    company_id?: number;

    @Column()
    ip_address: string
}