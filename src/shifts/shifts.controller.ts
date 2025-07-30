import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

import { CompanyAccessGuard } from 'src/common/guards/company-access/company-access.guard';
import { ShiftsService } from './shifts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Shift } from './shifts.entity';
import { Repository } from 'typeorm';
import { Department } from 'src/department/department.entity';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@Controller('shifts')
@UseGuards(AuthGuard)
export class ShiftsController {
    constructor(
        private readonly shiftsService: ShiftsService,

        private readonly usersService: UsersService,

        private readonly companyService: CompaniesService
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

    @Post('create')
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
