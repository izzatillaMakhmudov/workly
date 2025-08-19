import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from './shifts.entity';
import { Company } from 'src/companies/companies.entity';
import { Users } from 'src/users/user.entity';
import { ShiftsController } from './shifts.controller';
import { ShiftsService } from './shifts.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Department } from 'src/department/department.entity';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Shift,
            Users,
            Company
        ]),
        UsersModule,
        CompaniesModule
    ],
    controllers: [ShiftsController],
    providers: [ShiftsService, AuthGuard],
    exports: [ShiftsService]
})
export class ShiftsModule { }
