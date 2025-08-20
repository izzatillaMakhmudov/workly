import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './shifts.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Company } from 'src/companies/companies.entity';

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


    async createShift(dto: CreateShiftDto, adminId: number, role: string) {
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

        const newShift = this.shiftsRepository.create({
            ...dto,
            company: company ?? undefined,
        })

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