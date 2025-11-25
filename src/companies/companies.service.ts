import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from './companies.entity';
import { UserGender, UserRole, Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Terminal } from 'src/terminals/terminals.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Department } from 'src/department/department.entity';
import { Shift } from 'src/shifts/shifts.entity';


@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Terminal)
        private readonly terminalRepository: Repository<Terminal>,

        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,

        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>

    ) { }

    async findUsersByCompanyId(companyId: number): Promise<Company | null> {
        return this.companyRepository.findOne({
            where: { id: companyId },
            relations: ['users'],
        });
    }


    async createCompany(dto: CreateCompanyDto, adminRole: string) {
        if (adminRole !== 'super_admin') {
            throw new ForbiddenException("Only super admins can create companies")
        }
        try {
            const existingCompany = await this.companyRepository.findOne({
                where: { name: dto.name },
            });

            if (existingCompany) {
                throw new ConflictException(`Company with name "${dto.name}" already exists`);
            }

            const newCompany = this.companyRepository.create({
                name: dto.name,
                industry: dto.industry,
                stir: dto.stir,
                address: dto.address
            })

            const savedCompany = await this.companyRepository.save(newCompany);

            const newUser = this.usersRepository.create({
                first_name: dto.first_name,
                last_name: dto.last_name,
                email: dto.email,
                password: dto.password,
                pinfl: dto.pinfl,
                gender: dto.gender,
                role: UserRole.COMPANY_ADMIN,
                company: savedCompany
            })

            const newShift = this.shiftRepository.create({
                name: "Default Shift",
                start_time: "09:00",
                end_time: "18:00",
                break_start: "13:00",
                break_end: "14:00",
                company: savedCompany

            })

            const newDepartment = this.departmentRepository.create({
                name: "Default Department",
                company: savedCompany
            })

            await this.shiftRepository.save(newShift);
            await this.departmentRepository.save(newDepartment);


            const savedUser = await this.usersRepository.save(newUser)

            return {
                company: plainToInstance(Company, savedCompany),
                adminUser: plainToInstance(Users, savedUser),
            };
        } catch (err) {
            console.error(err)
            throw new ForbiddenException("Something went wrong while creating company")
        }
    }

    async findAll(role: string): Promise<Company[] | null> {
        if (role !== 'super_admin') {
            throw new ForbiddenException("Something went wrong")
        }

        return await this.companyRepository.find({})
    }

    async findOne(id: number, adminId: number, role: string) {
        if (role === 'super_admin') {
            const company = await this.companyRepository.findOne({
                where: { id },
            });
            if (!company) {
                throw new NotFoundException(`Company with ID ${id} not found`);
            }
            return company
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const company = await this.companyRepository.findOne({
            where: { id },
        });

        if (company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        return company

    }

    async update(id: number, dto: UpdateCompanyDto, adminId: number, role: string) {
        const company = await this.companyRepository.findOne({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        if (role === 'super_admin') {
            // ✅ allowed
        } else if (role === 'company_admin') {
            const admin = await this.usersRepository.findOne({
                where: { id: adminId },
                relations: ['company']
            });

            if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

            if (company?.id !== admin.company.id) {
                throw new ForbiddenException("Something went wrong")
            }
        } else {
            throw new ForbiddenException("Something went wrong");
        }

        if (dto.name && dto.name !== company.name) {
            const existingCompany = await this.companyRepository.findOne({
                where: { name: dto.name }
            });

            if (existingCompany) {
                throw new ConflictException(`Company with name "${dto.name}" already exists`);
            }
        }

        await this.companyRepository.update(id, dto)
        return this.companyRepository.findOne({ where: { id } })
    }

    async delete(id: number, role: string) {
        if (role !== 'super_admin') {
            throw new ForbiddenException("Something went wrong")
        }

        const company = await this.companyRepository.findOne({
            where: { id },
        });

        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }

        await this.companyRepository.remove(company); // safer than delete(id), triggers hooks
        return { message: `Company with ID ${id} has been deleted` };
    }



}
