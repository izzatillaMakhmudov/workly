import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terminal } from './terminals.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';
import { Company } from 'src/companies/companies.entity';

@Injectable()
export class TerminalsService {
    constructor(
        @InjectRepository(Terminal)
        private readonly terminalRepository: Repository<Terminal>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>
    ) { }

    async createTerminal(adminId: number, dto: CreateTerminalDto, role: string) {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        let company: Company | null = null

        if (role === 'super_admin') {
            if (dto.company_id) {
                company = await this.companyRepository.findOne({ where: { id: dto.company_id } });
                if (!company) throw new NotFoundException('Company not found');
            }
        } else {
            company = admin.company;
        }

        const newTerminal = this.terminalRepository.create({
            ...dto,
            company: company ?? undefined,
        })

        return this.terminalRepository.save(newTerminal)
    }

    async findAllTerminals(adminId: number, role: string): Promise<Terminal[]> {
        if (role === 'super_admin') {
            const allTerminals = await this.terminalRepository.find({
                relations: ['company']
            })

            if (!allTerminals) {
                throw new NotFoundException("Shifts Not Found")
            }

            return allTerminals
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        const terminals = this.terminalRepository.find({
            where: { company: { id: admin?.company.id } },
            relations: ['company']
        })

        if (!terminals) {
            throw new NotFoundException("Shifts Not Found")
        }

        return terminals
    }

    async findOne(adminId: number, id: number, role: string): Promise<Terminal | null> {
        if (role === 'super_admin') {
            const oneTerminal = await this.terminalRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneTerminal) {
                throw new NotFoundException("Shift Not Found")
            }

            return oneTerminal
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned');
        }

        const terminal = await this.terminalRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!terminal) {
            throw new NotFoundException("Shift Not Found")
        }

        if (terminal?.company?.id !== admin.company.id) {
            throw new UnauthorizedException('Something went wrong')
        }

        return terminal
    }

    async update(adminId: number, id: number, dto: UpdateTerminalDto, role: string): Promise<Terminal | null> {
        if (role === 'super_admin') {
            const oneTerminal = await this.terminalRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneTerminal) {
                throw new NotFoundException("Shift Not Found")
            }

            await this.terminalRepository.update(id, dto)
            return this.terminalRepository.findOne({ where: { id } })
        }

        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        const terminal = await this.terminalRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!terminal) {
            throw new NotFoundException("Shift Not Found")
        }

        if (terminal?.company?.id !== admin.company.id) {
            throw new UnauthorizedException('Something went wrong')
        }

        await this.terminalRepository.update(id, dto)
        return this.terminalRepository.findOne({ where: { id } })
    }

    async delete(adminId: number, id: number, role: string): Promise<void> {
        if (role === 'super_admin') {
            const oneTerminal = await this.terminalRepository.findOne({
                where: { id },
                relations: ['company']
            })

            if (!oneTerminal) {
                throw new NotFoundException("Shift Not Found")
            }

            await this.terminalRepository.delete(id)
            return

        }
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        const terminal = await this.terminalRepository.findOne({
            where: { id },
            relations: ['company']
        })

        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }

        if (terminal?.company?.id !== admin.company.id) {
            throw new UnauthorizedException('Something went wrong')
        }

        await this.terminalRepository.delete(id)
        return
    }

}
