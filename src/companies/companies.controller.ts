import { Controller, Get, InternalServerErrorException, Param, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';



@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @UseGuards(AuthGuard)
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


}
