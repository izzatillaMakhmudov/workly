import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Request } from 'express';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
@UseGuards(AuthGuard)
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService
    ) { }

    @Post()
    async createDepartment(@Req() req: Request, @Body() dto: CreateDepartmentDto) {

        const admin = req['user']
        return this.departmentService.createDepartment(admin.sub, dto)

    }

    @Get()
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.departmentService.findAllDepartments(admin.sub)
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.departmentService.findOne(admin.sub, id)

    }

    @Patch(':id')
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateDepartmentDto) {
        const admin = req['user']
        return this.departmentService.update(admin.sub, id, dto)
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.departmentService.delete(admin.sub, id)
    }
}
