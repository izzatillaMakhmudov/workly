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


}
