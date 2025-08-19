import { Module } from '@nestjs/common';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/user.entity';
import { Terminal } from './terminals.entity';
import { UsersModule } from 'src/users/users.module';
import { CompaniesModule } from 'src/companies/companies.module';
import { AuthGuard } from 'src/auth/auth.guard';
import { Company } from 'src/companies/companies.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Terminal,
      Company
    ]),
    UsersModule,
    CompaniesModule
  ],
  controllers: [TerminalsController],
  providers: [TerminalsService, AuthGuard],
  exports: [TerminalsService]
})
export class TerminalsModule { }
