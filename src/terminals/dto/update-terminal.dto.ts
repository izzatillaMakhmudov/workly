import { Column } from "typeorm";

export class UpdateTerminalDto {
    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    serial_number: string

    @Column()
    location: string

    @Column()
    ip_address: string
}