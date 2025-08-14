import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admins')
export class Admins {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    full_name: string
}