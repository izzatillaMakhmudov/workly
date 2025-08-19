import { BadRequestException, Body, ForbiddenException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';
import { Company } from 'src/companies/companies.entity';
import { Department } from 'src/department/department.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserPermissions } from './permissions.enum';
import { plainToInstance } from 'class-transformer';
import { Shift } from 'src/shifts/shifts.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,

        @InjectRepository(Department)
        private readonly departmentRepository: Repository<Department>,

        @InjectRepository(Shift)
        private readonly shiftRepository: Repository<Shift>
    ) { }

    async createUser(dto: CreateUserDto, adminId: number, role: string): Promise<Users | null> {

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        let company: Company | null = null;
        let department: Department | null = null;
        let shift: Shift | null = null;


        if (role === 'super_admin') {
            if (dto.company_id) {
                company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
                if (!company) throw new NotFoundException('Company not found');
            }

            if (dto.department_id) {
                department = await this.departmentRepository.findOne({ where: { id: dto.department_id } });
                if (!department) throw new NotFoundException('Department not found');
            }

            if (dto.shift_id) {
                shift = await this.shiftRepository.findOne({ where: { id: dto.shift_id } });
                if (!shift) throw new NotFoundException('Shift not found');
            }
        } else {
            
            company = admin.company;
        }
        const newUser = this.usersRepository.create({
            ...dto,
            hashed_password: dto.hashed_password,
            company: company ?? undefined,
            department: department ?? undefined,
            shift: shift ?? undefined
        });

        const saved = await this.usersRepository.save(newUser);
        return plainToInstance(Users, saved);
    }

    async findAll(adminId: number, role: string): Promise<Users[]> {
        if (role === 'super_admin') {
            const allUsers = await this.usersRepository.find({
                relations: ['company', 'department', 'shift']
            })
            return plainToInstance(Users, allUsers);
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const users = await this.usersRepository.find({
            where: { company: { id: admin.company.id } },
            relations: ['company']
        })

        return plainToInstance(Users, users)
    }

    async findOne(adminId: number, id: number, role: string): Promise<Users | null> {
        if (role === 'super_admin') {
            const oneUser = await this.usersRepository.findOne({
                where: { id },
                relations: ['company', 'department', 'shift']
            })

            if (!oneUser) {
                throw new NotFoundException('User Not Found')
            }
            return plainToInstance(Users, oneUser);
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company', 'department', 'shift']
        })

        if (!user) {
            throw new NotFoundException('User Not Found')
        }

        if (user?.company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        return plainToInstance(Users, user)
    }

    async findOneByEmail(email: string): Promise<Users | null> {
        return this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.company', 'company')
            .where('user.email = :email', { email })
            .getOne();
    }

    async update(adminId: number, id: number, updateUserDto: UpdateUserDto, role: string): Promise<Users | null> {
        if (role === 'super_admin') {
            const oneUser = await this.usersRepository.findOne({
                where: { id },
                relations: ['company', 'department', 'shift']
            })

            if (!oneUser) {
                throw new NotFoundException('User Not Found')
            }

            if (updateUserDto.password) {
                (updateUserDto as any).hashed_password = updateUserDto.password;
                delete (updateUserDto as any).password;
            }

            Object.assign(oneUser, updateUserDto);
            const result = await this.usersRepository.save(oneUser);
            return plainToInstance(Users, result)
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!user) throw new NotFoundException('User not found');

        if (user?.company?.id !== admin.company.id) {
            throw new ForbiddenException("Something went wrong")
        }

        if (updateUserDto.password) {
            (updateUserDto as any).hashed_password = updateUserDto.password;
            delete (updateUserDto as any).password;
        }

        Object.assign(user, updateUserDto);
        const result = await this.usersRepository.save(user);

        return plainToInstance(Users, result)
    }

    async delete(adminId: number, id: number, role: string): Promise<void> {
        if (role === 'super_admin') {
            const user = await this.usersRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!user) {
                throw new NotFoundException('User not found')
            }

            await this.usersRepository.delete(id);
            return
        }
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
        return 
    }

    async updatePermissions(userId: number, permissions: UserPermissions[]) {
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) throw new NotFoundException('User not found');

        user.permissions = permissions;
        return this.usersRepository.save(user);
    }

}

