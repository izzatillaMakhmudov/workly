
import { Column } from "typeorm";

export class UpdateDepartmentDto {
    @Column({ nullable: false })
    name: string;

    @Column({ nullable: true })
    description: string;
}