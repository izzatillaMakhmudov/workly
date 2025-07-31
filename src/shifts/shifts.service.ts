import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './shifts.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Injectable()
export class ShiftsService {
    constructor(
        @InjectRepository(Shift)
        private readonly shiftsRepository: Repository<Shift>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }


    async createShift(dto: CreateShiftDto, adminId: number) {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        // console.log('Admin:', admin?.company?.id);

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned')

        const newShift = this.shiftsRepository.create({
            ...dto,
            company: admin.company,
        })

        // console.log('New Shift:', newShift);

        return this.shiftsRepository.save(newShift);
    }

    async findOne(adminId: number, id: number): Promise<Shift | null> {
        // console.log('Fetching shift with ID:', id);

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        // console.log('Admin ID:', adminId);

        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['company']
        });

        if (shift?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong');
        }
        return shift;
    }


    async findAll(adminId: number): Promise<Shift[]> {
        // console.log('Fetching shifts for admin ID:', adminId);
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        // console.log('Admin:', admin);

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');

        return this.shiftsRepository.find({
            where: { company: { id: admin.company.id } }
        });
    }

    async delete(adminId: number, id: number): Promise<void> {
        // console.log('Deleting shift with ID:', id);
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        });

        if (!admin || !admin.company) throw new UnauthorizedException('Admin has no company assigned');


        // console.log('Admin:', admin);

        const shift = await this.shiftsRepository.findOne({
            where: { id },
            relations: ['company']
        });

        if (!shift) throw new NotFoundException("Shift not found")

        if (shift?.company?.id !== admin.company.id) {
            throw new ForbiddenException('Something went wrong');
        }

        await this.shiftsRepository.delete(id)
    }

    async update(adminId: number, id: number, updateShiftDto: UpdateShiftDto): Promise<Shift | null> {
        // console.log('Updating the shift with id: ', id)

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

        await this.shiftsRepository.update(id, updateShiftDto)
        return this.shiftsRepository.findOne({ where: { id } })
    }


}