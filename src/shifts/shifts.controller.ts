import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shifts')
@UseGuards(AuthGuard)
export class ShiftsController {
    constructor(
        private readonly shiftsService: ShiftsService,
    ) { }

    @Get('')
    async fidAll(@Req() req: Request) {
        const admin = req['user'];
        // console.log('req: ', req['user']);
        return this.shiftsService.findAll(admin.sub);
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        // console.log('Fetching shift with ID:', id);
        const admin = req['user'];
        return this.shiftsService.findOne(admin.sub, id );
    }

    @Post('')
    async createShift(@Req() req: Request, @Body() dto: CreateShiftDto) {
        const admin = req['user'];
        // console.log('req: ', req['user']);
        return this.shiftsService.createShift(dto, admin.sub);
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user'];
        return this.shiftsService.delete(admin.sub, id);
    }

    @Patch(':id')
    async update(@Param('id') id:number, @Req() req:Request, @Body() dto: UpdateShiftDto){
        const admin = req['user'];
        return this.shiftsService.update(admin.sub, id, dto);
    }

}
