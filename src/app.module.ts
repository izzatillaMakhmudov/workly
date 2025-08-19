import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { Users } from './users/user.entity';
import { Company } from './companies/companies.entity';
import { Attendance_log } from './attendance/attendance.entity';
import { Terminal } from './terminals/terminals.entity';
import { Shift } from './shifts/shifts.entity';
import { Work_session } from './sessions/sessions.entity';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceModule } from './attendance/attendance.module';
import { SessionsModule } from './sessions/sessions.module';
import { ShiftsController } from './shifts/shifts.controller';
import { ShiftsService } from './shifts/shifts.service';
import { ShiftsModule } from './shifts/shifts.module';
import { TerminalsModule } from './terminals/terminals.module';
import { DepartmentController } from './department/department.controller';
import { DepartmentService } from './department/department.service';
import { DepartmentModule } from './department/department.module';
import { Department } from './department/department.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CompaniesService } from './companies/companies.service';
import { CompaniesModule } from './companies/companies.module';
import { JobTitleController } from './job-title/job-title.controller';
import { JobTitleService } from './job-title/job-title.service';
import { JobTitleModule } from './job-title/job-title.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (ConfigService: ConfigService) => ({
        type: 'postgres',
        host: ConfigService.get<string>('DB_HOST'),
        port: ConfigService.get<number>('DB_PORT'),
        username: ConfigService.get<string>('DB_USERNAME'),
        password: ConfigService.get<string>('DB_PASSWORD'),
        database: ConfigService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        entities: [Users, Company, Attendance_log, Terminal, Shift, Work_session, Department],
        synchronize: true,
      }),
      inject: [ConfigService]
    }),

    AuthModule,
    UsersModule,
    AttendanceModule,
    SessionsModule,
    ShiftsModule,
    TerminalsModule,
    DepartmentModule,
    CompaniesModule,
    JobTitleModule,
    
  ],
  providers: [
    AuthService,
    
  ],

  controllers: [
    AuthController,
    AttendanceController,
    ShiftsController,
    DepartmentController,
    JobTitleController,
    
  ],
  exports: [AuthService]

})
export class AppModule { }