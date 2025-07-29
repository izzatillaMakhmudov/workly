import { BadRequestException, Body, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/companies.entity';
import { Department } from 'src/department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,

        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>
    ) { }

    async findOneByEmail(email: string): Promise<Users | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.company', 'company')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findAll(companyId: number): Promise<Users[]> {
        return this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.email', 'user.name', 'user.role', 'user.is_active', 'company.name'])
            .leftJoin('user.company', 'company')
            .where('user.company_id = :companyId', { companyId })
            .getMany();
    }

    

    async createFromAdmin(dto: CreateUserDto, adminId: number) {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const department = await this.departmentRepository.findOne({
            where: {
                id: dto.department_id,
                company: { id: admin.company.id },
            },
            relations: ['company'],
        });

        if (!department) {
            throw new BadRequestException('Invalid department selected');
        }

        const newUser = this.usersRepository.create({
            ...dto,
            company: admin.company,
            department: department,
        })

        return this.usersRepository.save(newUser);

    }


}

