import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './shifts.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Company } from 'src/companies/companies.entity';
import { toMinutes } from './utils/time-utils';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private readonly shiftsRepository: Repository<Shift>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>
    ) { }

    // Old version
    // async createShift(dto: CreateShiftDto, adminId: number, role: string) {
    //     const admin = await this.usersRepository.findOne({
    //         where: { id: adminId },
    //         relations: ['company']
    //     });

    //     if (!admin || !admin.company) {
    //         throw new UnauthorizedException('Admin has no company assigned')
    //     }

    //     let company: Company | null = null;

    //     if (role === 'super_admin') {
    //         if (dto.company_id) {
    //             company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
    //             if (!company) throw new NotFoundException('Company not found');
    //         }
    //     } else {
    //         company = admin.company;
    //     }

    //     const newShift = this.shiftsRepository.create({
    //         ...dto,
    //         company: company ?? undefined,
    //     })

    //     return this.shiftsRepository.save(newShift);
    // }

    // New version with validation
    async createShift(dto: CreateShiftDto, adminId: number, role: string) {
        // 1. Validate time logic
        const start = toMinutes(dto.start_time);
        const end = toMinutes(dto.end_time);
        const breakStart = toMinutes(dto.break_start);
        const breakEnd = toMinutes(dto.break_end);

        if (start >= end) {
            throw new BadRequestException("Start time must be before end time");
        }

        if (breakStart >= breakEnd) {
            throw new BadRequestException("Break start must be before break end");
        }

        if (breakStart < start || breakEnd > end) {
            throw new BadRequestException("Break must be inside shift time");
        }

        // 2. Continue with your existing company logic
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
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

        const newShift = this.shiftsRepository.create({
            ...dto,
            company: company ?? undefined,
        });

        return this.shiftsRepository.save(newShift);
    }

    async findAll(adminId: number, role: string): Promise<Shift[]> {
        if (role === "super_admin") {
            const allShifts = await this.shiftsRepository.find({
                relations: ['company']
            })

            if (!allShifts) {
                throw new NotFoundException("Shifts Not Found")
            }

            return allShifts
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });


        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const shifts = await this.shiftsRepository.find({
            where: { company: { id: admin.company.id } },
            relations: ['company']
        });

        if (!shifts) {
            throw new NotFoundException("Shifts Not Found")
        }

        return shifts
    }

    async findOne(adminId: number, id: number, role: string): Promise<Shift | null> {
        if (role === 'super_admin') {
            const oneShift = await this.shiftsRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneShift) {
                throw new NotFoundException("Shift Not Found")
            }

            return oneShift
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['company']
        });

        if (!shift) {
            throw new NotFoundException("Shift Not Found")
        }

        if (shift?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong');
        }
        return shift;
    }

    async update(adminId: number, id: number, updateShiftDto: UpdateShiftDto, role: string): Promise<Shift | null> {
        if (role === 'super_admin') {
            const oneShift = await this.shiftsRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneShift) {
                throw new NotFoundException("Shift Not Found")
            }

            await this.shiftsRepository.update(id, updateShiftDto)
            return this.shiftsRepository.findOne({ where: { id } })
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['company']
        });

        if (shift?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong');
        }

        if (!shift) {
            throw new NotFoundException("Shift Not Found")
        }



        await this.shiftsRepository.update(id, updateShiftDto)
        return this.shiftsRepository.findOne({ where: { id } })
    }

    async delete(adminId: number, id: number, role: string): Promise<void> {
        if (role === 'super_admin') {
            const oneShift = await this.shiftsRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneShift) {
                throw new NotFoundException("Shift Not Found")
            }

            await this.shiftsRepository.delete(id)
            return
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['company']
        });

        if (!shift) throw new NotFoundException("Shift not found")

        if (shift?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong');
        }

        await this.shiftsRepository.delete(id)
        return
    }


}