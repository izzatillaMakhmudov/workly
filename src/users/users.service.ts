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
        console.log('UpdateUserDto:', updateUserDto);
        console.log('AdminId:', adminId, 'UserId to update:', id, 'Role:', role);
        
        // Handle password field mapping (if front sends plain password)   
        if (role === 'super_admin') {
            const oneUser = await this.usersRepository.findOne({
                where: { id },
                relations: ['company', 'department', 'shift']
            });

            if (!oneUser) {
                throw new NotFoundException('User Not Found');
            }

            if (updateUserDto.password) {
                (updateUserDto as any).hashed_password = updateUserDto.password;
                delete (updateUserDto as any).password;
            }

            if (updateUserDto.company_id) {
                oneUser.company = { id: updateUserDto.company_id } as any;
                console.log('Mapped company_id to company relation:', oneUser.company);
                delete (updateUserDto as any).company_id;
            }

            Object.assign(oneUser, updateUserDto);

            const result = await this.usersRepository.save(oneUser);
            return plainToInstance(Users, result);
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

    // inside your service
    // async update(
    //     adminId: number,
    //     id: number,
    //     updateUserDto: UpdateUserDto,
    //     role: string,
    // ): Promise<Users> {
    //     // create a shallow copy so we can mutate safely
    //     const dto: any = { ...updateUserDto };

    //     // accept either company_id (snake) or companyId (camel) from frontend
    //     const incomingCompanyId = dto.company_id ?? dto.companyId;
    //     if (incomingCompanyId !== undefined && incomingCompanyId !== null && incomingCompanyId !== '') {
    //         // normalize to numeric company_id
    //         dto.company_id = Number(incomingCompanyId);
    //         delete dto.companyId;
    //         if (Number.isNaN(dto.company_id)) {
    //             throw new BadRequestException('company_id must be a number');
    //         }
    //     }

    //     console.log('Normalized DTO:', dto, 'adminId:', adminId, 'userId:', id, 'role:', role);

    //     // handle password field mapping (if front sends plain password)
    //     if (dto.password) {
    //         (dto as any).hashed_password = dto.password;
    //         delete dto.password;
    //     }

    //     // -------------------
    //     // SUPER ADMIN PATH
    //     // -------------------
    //     if (role === 'super_admin') {
    //         const oneUser = await this.usersRepository.findOne({
    //             where: { id },
    //             relations: ['company', 'department', 'shift'],
    //         });

    //         if (!oneUser) throw new NotFoundException('User Not Found');

    //         // If company_id provided, map it to company relation
    //         if (dto.company_id !== undefined) {
    //             // optional: validate company exists (recommended)
    //             if (this.companyRepository) {
    //                 const company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
    //                 if (!company) throw new NotFoundException('Company not found');
    //                 oneUser.company = company;
    //             } else {
    //                 // fallback: assign minimal object (TypeORM accepts { id })
    //                 oneUser.company = { id: dto.company_id } as any;
    //             }
    //             // remove scalar so Object.assign doesn't try to set company_id (not a property)
    //             delete dto.company_id;
    //         }

    //         // assign remaining fields
    //         Object.assign(oneUser, dto);

    //         const result = await this.usersRepository.save(oneUser);
    //         console.log('Updated user (super_admin):', result);
    //         return plainToInstance(Users, result);
    //     }

    //     // -------------------
    //     // COMPANY ADMIN PATH
    //     // -------------------
    //     const admin = await this.usersRepository.findOne({
    //         where: { id: adminId },
    //         relations: ['company'],
    //     });

    //     if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

    //     const user = await this.usersRepository.findOne({
    //         where: { id },
    //         relations: ['company'],
    //     });

    //     if (!user) throw new NotFoundException('User not found');

    //     // the admin can only edit users from their own company
    //     if (user.company?.id !== admin.company.id) {
    //         throw new ForbiddenException('You cannot edit this user');
    //     }

    //     // company_admin MUST NOT change company -> ignore company_id if present
    //     if ('company_id' in dto) {
    //         delete dto.company_id;
    //     }

    //     Object.assign(user, dto);
    //     const result = await this.usersRepository.save(user);
    //     console.log('Updated user (company_admin):', result);
    //     return plainToInstance(Users, result);
    // }


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

