import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Company } from 'src/companies/companies.entity';
import { Shift } from 'src/shifts/shifts.entity';

@Injectable()
export class DepartmentService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,

        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>,

        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

    async createDepartment(adminId: number, dto: CreateDepartmentDto, role: string): Promise<Department | null> {
        
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        let company: Company | null = null;

        if (role === 'super_admin') {
            if (dto.company_id) {
                company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
                if (!company) throw new NotFoundException('Company not found');
            }
        } else {
            company = admin.company;
        }

        const newDepartment = this.departmentRepository.create({
            ...dto,
            company: company ?? undefined
        })

        const saved = await this.departmentRepository.save(newDepartment)

        return saved
    }

    async findAllDepartments(adminId: number, role: string): Promise<Department[]> {
        if (role === 'super_admin') {
            const allDepartments = await this.departmentRepository.find({
                relations: ['company']
            })

            return allDepartments
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const departments = this.departmentRepository.find({
            where: { company: { id: admin.company.id } },
            relations: ['company']
        })

        return departments
    }

    async findOne(adminId: number, id: number, role: string): Promise<Department | null> {
        if (role === 'super_admin') {
            const oneDepartment = await this.departmentRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneDepartment) {
                throw new NotFoundException("Department Not Found")
            }

            return oneDepartment
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!department) {
            throw new NotFoundException("Department Not Found")
        }

        if (department?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong')
        }

        return department
    }

    async update(adminId: number, id: number, updateDepartmentDto: UpdateDepartmentDto, role: string): Promise<Department | null> {

        if (role === 'super_admin') {
            const oneDepartment = await this.departmentRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneDepartment) {
                throw new NotFoundException("Department Not Found")
            }

            await this.departmentRepository.update(id, updateDepartmentDto)
            return this.departmentRepository.findOne({
                where: { id },
                relations: ['company']
            })

        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const department = await this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!department) {
            throw new NotFoundException("Department Not Found")
        }

        if (department?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong')
        }

        await this.departmentRepository.update(id, updateDepartmentDto)
        return this.departmentRepository.findOne({
            where: { id },
            relations: ['company']
        })
    }

    async delete(adminId: number, id: number, role: string): Promise<void> {
        if (role === 'super_admin') {
            const oneDepartment = await this.departmentRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneDepartment) {
                throw new NotFoundException("Department Not Found")
            }

            await this.departmentRepository.delete(id)
            return
        }

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
        return
    }

}
