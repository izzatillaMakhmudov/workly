import { BadRequestException, Body, ForbiddenException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/companies.entity';
import { Department } from 'src/department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPermissions } from './permissions.enum';

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

    async createUser(dto: CreateUserDto, adminId: number): Promise<Users | null> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        const newUser = this.usersRepository.create({
            ...dto,
            company: admin.company,
        })

        return this.usersRepository.save(newUser);
    }

    async findAll(adminId: number): Promise<Users[]> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const users = this.usersRepository.find({
            where: { company: { id: admin.company.id } },
            relations: ['company']
        })

        return users;
    }

    async findOne(adminId: number, id: number): Promise<Users | null> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (user?.company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        return user
    }

    async findOneByEmail(email: string): Promise<Users | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.company', 'company')
            .where('user.email = :email', { email })
            .getOne();
    }

    async update(adminId: number, id: number, updateUserDto: UpdateUserDto): Promise<Users | null> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (user?.company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        await this.usersRepository.update(id, updateUserDto);
        return this.usersRepository.findOne({ where: { id } });
    }

    async delete(adminId: number, id: number): Promise<void> {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user?.company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        await this.usersRepository.delete(id);
    }

    async updatePermissions(userId: number, permissions: UserPermissions[]) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.permissions = permissions;
        return this.usersRepository.save(user);
    }




}

