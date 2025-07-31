import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

    async createDepartment(adminId: number, dto: CreateDepartmentDto) {

        // console.log("admin id:, ", adminId)
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const newDepartment = this.departmentRepository.create({
            ...dto,
            company: admin.company,
        })

        return this.departmentRepository.save(newDepartment)
    }

    async findAllDepartments(adminId: number): Promise<Department[]> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const departments = this.departmentRepository.find({
            where: { company: { id: admin.company.id } },
            relations: ['company']
        })

        // console.log("departments: ", departments)
        return departments
    }

    async findOne(adminId: number, id: number): Promise<Department | null> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (department?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong')
        }

        return department
    }

    async update(adminId: number, id: number, updateDepartmentDto: UpdateDepartmentDto) {

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (department?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong')
        }

        await this.departmentRepository.update(id, updateDepartmentDto)
        return this.departmentRepository.findOne({ where: { id } })
    }

    async delete(adminId: number, id: number): Promise<void> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!department) {
            throw new NotFoundException('Department not found');
        }


        if (department?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong')
        }

        await this.departmentRepository.delete(id)
    }

}
