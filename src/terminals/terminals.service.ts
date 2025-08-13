import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Terminal } from './terminals.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/user.entity';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';

@Injectable()
export class TerminalsService {
    constructor(
        @InjectRepository(Terminal)
        private readonly terminalRepository: Repository<Terminal>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

    async createTerminal(adminId: number, dto: CreateTerminalDto) {
        const admin = await this.usersRepository.findOne({
            where: { id: adminId },
            relations: ['company']
        })

        if (!admin || !admin.company) {
            throw new UnauthorizedException('Admin has no company assigned')
        }

        const newTerminal = this.terminalRepository.create({
            ...dto,
            company: admin.company
        })

        return this.terminalRepository.save(newTerminal)
    }

    async findAllTerminals(adminId: number): Promise<Terminal[]> {
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

        return terminals
    }

    async findOne(adminId: number, id: number): Promise<Terminal | null> {

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

        if (terminal?.company?.id !== admin.company.id) {
            throw new UnauthorizedException('Something went wrong')
        }

        return terminal
    }

    async update(adminId: number, id: number, dto: UpdateTerminalDto): Promise<Terminal | null> {

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


        if (terminal?.company?.id !== admin.company.id) {
            throw new UnauthorizedException('Something went wrong')
        }

        await this.terminalRepository.update(id, UpdateTerminalDto)
        return this.terminalRepository.findOne({ where: { id } })
    }

    async delete(adminId: number, id: number): Promise<void> {
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
    }

}
