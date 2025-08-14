import { Column } from "typeorm";

export class CreateAdminDto {
    @Column({ nullable: false })
    username: string

    @Column({ nullable: false })
    password: string

    @Column({ nullable: false })
    first_name: string
}