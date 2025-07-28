import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

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
      entities: [User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User]
    )
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
