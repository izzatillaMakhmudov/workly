import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';
import { Department } from './department.entity';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Users,
            Department
        ]),
        UsersModule,
        CompaniesModule
    ],
    controllers: [DepartmentController],
    providers: [DepartmentService, AuthGuard],
    exports: [DepartmentService]
})
export class DepartmentModule {}
