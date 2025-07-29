import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { CompaniesService } from './companies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './companies.entity';
import { Users } from 'src/users/user.entity';
import { Terminal } from 'src/terminals/terminals.entity';
import { Department } from 'src/department/department.entity';
import { Shift } from 'src/shifts/shifts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Company,
    Users,
    Terminal,
    Department,
    Shift
  ])],
  providers: [AuthGuard, CompaniesService],
  controllers: [CompaniesController],
  exports: [CompaniesService],
})
export class CompaniesModule { }
