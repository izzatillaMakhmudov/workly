import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UsersController } from './users.controller';
import { AuthGuard } from 'src/auth/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users])
  ],
  providers: [
    UsersService,
    AuthGuard
  ],
  exports: [UsersService],
  controllers: [UsersController]
})
export class UsersModule { }
