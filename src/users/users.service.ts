import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>
    ) { }

    async findOneByEmail(email: string): Promise<Users | null> {
        return this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.company', 'company')
        .where('user.email = :email', { email })
        .getOne();
    }

    async findAll(companyId: number): Promise<Users[]> {
        return this.usersRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.username', 'user.email', 'user.name', 'user.role', 'user.is_active', 'company.name'])
            .leftJoin('user.company', 'company')
            .where('user.company_id = :companyId', { companyId })
            .getMany();
    }

}

