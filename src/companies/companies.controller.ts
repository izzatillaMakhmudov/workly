import { Controller, Get, InternalServerErrorException, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from 'src/department/department.entity';
import { Repository } from 'typeorm';
import { CompanyAccessGuard } from 'src/common/guards/company-access/company-access.guard';



@Controller('my-company')
@UseGuards(AuthGuard, CompanyAccessGuard)
export class CompaniesController {
    constructor(
        @InjectRepository(Department)
        private readonly departmentRepo: Repository<Department>,
        private readonly companiesService: CompaniesService,
        private readonly usersService: UsersService,
    ) { }


    @Get(':id/users')
    async findUsersByCompanyId(
        @Param('id') id: number
    ) {
        console.log('Fetching users for company ID:', id);
        const company = await this.companiesService.findUsersByCompanyId(+id)
        if (!company) {
            throw new InternalServerErrorException('Company not found');
        }
        return company.users;
    }


    @Get('departments')
    async getDepartmentsForCompany(@Req() req: Request) {
        const user = req['user'];
        const admin = await this.usersService.findById(user.sub);
        if (!admin?.company) throw new UnauthorizedException();

        return this.departmentRepo.find({
            where: { company: { id: admin.company.id } },
        });
    }



}
