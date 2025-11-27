import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/department/department.entity';
import { Repository } from 'typeorm';
import { CompanyAccessGuard } from 'src/common/guards/company-access/company-access.guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Industry } from './companies.entity';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UserPermissions } from 'src/users/permissions.enum';
import { PermissionGuard } from 'src/users/permission.guard';



@Controller('companies')
@UseGuards(AuthGuard, PermissionGuard)
export class CompaniesController {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,
        private readonly companiesService: CompaniesService,
        private readonly usersService: UsersService,
    ) { }

    @Post('')
    @Permissions(UserPermissions.CREATE_COMPANY)
    async createCompany(@Req() req: Request, @Body() dto: CreateCompanyDto) {
        const admin = req['user']
        return this.companiesService.createCompany(dto, admin.role)
    }

    @Get('industries')
    getIndustries() {
        return Object.values(Industry)
    }

    @Get('')
    @Permissions(UserPermissions.VIEW_COMPANY)
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.companiesService.findAll(admin.role)
    }

    @Get(':id')
    @Permissions(UserPermissions.VIEW_COMPANY)
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.companiesService.findOne(id, admin.sub, admin.role)
    }

    @Patch(':id')
    @Permissions(UserPermissions.UPDATE_COMPANY)
    async update(@Param('id') id: number, @Body() dto: UpdateCompanyDto, @Req() req: Request) {
        const admin = req['user']
        return this.companiesService.update(id, dto, admin.sub, admin.role)
    }

    @Delete(':id')
    @Permissions(UserPermissions.DELETE_COMPANY)
    async delete(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.companiesService.delete(id, admin.role)
    }

}
