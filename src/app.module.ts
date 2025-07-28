import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';



@Module({
  imports: [
    AuthModule,
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]

})
export class AppModule { }
