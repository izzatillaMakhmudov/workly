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
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceModule } from './attendance/attendance.module';
import { SessionsModule } from './sessions/sessions.module';
import { ShiftsController } from './shifts/shifts.controller';
import { ShiftsService } from './shifts/shifts.service';
import { ShiftsModule } from './shifts/shifts.module';
import { TerminalsModule } from './terminals/terminals.module';



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
    EmployeesModule,
    AttendanceModule,
    SessionsModule,
    ShiftsModule,
    TerminalsModule
  ],
  providers: [AuthService, EmployeesService, AttendanceService, ShiftsService],
  controllers: [AuthController, EmployeesController, AttendanceController, ShiftsController],
  exports: [AuthService]

})
export class AppModule { }