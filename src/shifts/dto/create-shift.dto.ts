import { Column } from "typeorm";

export class CreateShiftDto {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    start_time: string;

    @Column({ nullable: false })
    end_time: string;

    @Column({ nullable: false })
    break_start: string;

    @Column({ nullable: false })
    break_end: string;
}