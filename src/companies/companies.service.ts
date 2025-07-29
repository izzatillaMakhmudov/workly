import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Company } from './companies.entity';
import { Users } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Terminal } from 'src/terminals/terminals.entity';


@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,

        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,

        @InjectRepository(Terminal)
        private readonly terminalRepository: Repository<Terminal>,

    ) { }

    async findUsersByCompanyId(companyId: number): Promise<Company | null> {
        return this.companyRepository.findOne({
            where: { id: companyId },
            relations: ['users'],
        });
    }

    
}
