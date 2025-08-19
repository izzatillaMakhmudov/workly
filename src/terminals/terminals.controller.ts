import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { Request, Response } from 'express';
import { UpdateTerminalDto } from './dto/update-terminal.dto';

@Controller('terminals')
@UseGuards(AuthGuard)
export class TerminalsController {
    constructor(
        private readonly terminalService: TerminalsService
    ) { }

    @Post()
    async createTerminal(@Req() req: Request, @Body() dto: CreateTerminalDto) {
        const admin = req['user']
        return this.terminalService.createTerminal(admin.sub, dto, admin.role)
        // return { admin}
    }

    @Get()
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.terminalService.findAllTerminals(admin.sub, admin.role)
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.terminalService.findOne(admin.sub, id, admin.role)
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateTerminalDto) {
        const admin = req['user']
        return this.terminalService.update(admin.sub, id, dto, admin.role)
    }

    @Delete(':id')
    async delete(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const admin = req['user']
        await this.terminalService.delete(admin.sub, id, admin.role)
        return res.status(HttpStatus.OK).json({ message: 'Terminal deleted successfully' });
    }
}
