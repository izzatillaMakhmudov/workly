import { Column } from "typeorm";

export class CreateDepartmentDto {
    
    @Column({nullable: false})
    name: string;

    @Column({nullable: true})
    description: string;

}