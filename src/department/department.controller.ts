import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { Request, Response } from 'express';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PermissionGuard } from 'src/users/permission.guard';
import { UserPermissions } from 'src/users/permissions.enum';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller('department')
@UseGuards(AuthGuard, PermissionGuard)
export class DepartmentController {
    constructor(
        private readonly departmentService: DepartmentService
    ) { }

    @Post()
    @Permissions(UserPermissions.CREATE_DEPARTMENT)
    async createDepartment(@Req() req: Request, @Body() dto: CreateDepartmentDto) {
        const admin = req['user']
        return this.departmentService.createDepartment(admin.sub, dto, admin.role)
    }

    @Get()
    @Permissions(UserPermissions.VIEW_DEPARTMENT)
    async findAll(@Req() req: Request, @Query('page') page: number = 1, @Query('size') size: number = 10) {
        const admin = req['user']
        return this.departmentService.findAllDepartments(admin.sub, admin.role, Number(page), Number(size))
    }

    @Get('company/:companyId')
    async findByCompany(@Param('companyId') companyId: number, @Req() req: Request) {
        const admin = req['user']
        return this.departmentService.getDepartmentsByCompany(companyId)
    }

    @Get(':id')
    @Permissions(UserPermissions.VIEW_DEPARTMENT)
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.departmentService.findOne(admin.sub, id, admin.role)

    }

    @Patch(':id')
    @Permissions(UserPermissions.UPDATE_DEPARTMENT)
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateDepartmentDto) {
        const admin = req['user']
        return this.departmentService.update(admin.sub, id, dto, admin.role)
    }

    @Delete(':id')
    @Permissions(UserPermissions.DELETE_DEPARTMENT)
    async remove(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const admin = req['user']
        await this.departmentService.delete(admin.sub, id, admin.role)

        return res.status(HttpStatus.OK).json({ message: 'Department deleted successfully' });
    }
}
