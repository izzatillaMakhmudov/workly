import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Request, Response } from 'express';
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
        return this.departmentService.createDepartment(admin.sub, dto, admin.role)
    }

    @Get()
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.departmentService.findAllDepartments(admin.sub, admin.role)
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.departmentService.findOne(admin.sub, id, admin.role)

    }

    @Patch(':id')
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateDepartmentDto) {
        const admin = req['user']
        return this.departmentService.update(admin.sub, id, dto, admin.role)
    }

    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const admin = req['user']
        await this.departmentService.delete(admin.sub, id, admin.role)

        return res.status(HttpStatus.OK).json({ message: 'Department deleted successfully' });
    }
}
