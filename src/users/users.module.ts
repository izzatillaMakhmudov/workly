import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersController } from './users.controller';
import { AuthGuard } from 'src/auth/auth.guard';
import { Company } from 'src/companies/companies.entity';
import { Department } from 'src/department/department.entity';
import { Shift } from 'src/shifts/shifts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Company,
      Department,
      Shift
    ])
  ],
  providers: [
    UsersService,
    AuthGuard,

  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
