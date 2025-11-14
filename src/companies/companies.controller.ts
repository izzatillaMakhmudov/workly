import { Body, Controller, Get, InternalServerErrorException, Param, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
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



@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,
        private readonly companiesService: CompaniesService,
        private readonly usersService: UsersService,
    ) { }

    @Post('')
    async createCompany(@Req() req: Request, @Body() dto: CreateCompanyDto) {
        const admin = req['user']
        return this.companiesService.createCompany(dto, admin.role)
    }

    @Get('industries')
    getIndustries(){
        return Object.values(Industry)
    }

    @Get('')
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.companiesService.findAll(admin.role)
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.companiesService.findOne(id, admin.sub, admin.role)
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateCompanyDto, @Req() req: Request) {
        const admin = req['user']
        return this.companiesService.update(id, dto, admin.sub, admin.role)
    }

}
