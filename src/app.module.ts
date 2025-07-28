import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { Users } from './users/user.entity';
import { Company } from './companies/companies.entity';
import { Attendance_log } from './attendance/attendance.entity';
import { Employee } from './employees/employees.entity';
import { Terminal } from './terminals/terminals.entity';
import { Shift } from './shifts/shifts.entity';
import { Work_session } from './sessions/sessions.entity';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';
import { EmployeesModule } from './employees/employees.module';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'izzatillamakhmudov',
      password: 'AnNur2227!',
      database: 'workly',
      autoLoadEntities: true,
      entities: [Users, Company, Attendance_log, Employee, Terminal, Shift, Work_session],
      synchronize: true,
    }),
    
    AuthModule,
    UsersModule,
    EmployeesModule
  ],
  providers: [AuthService, EmployeesService],
  controllers: [AuthController, EmployeesController],
  exports: [AuthService]

})
export class AppModule { }