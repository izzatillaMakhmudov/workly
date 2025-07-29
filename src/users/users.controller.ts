import { Body, Controller, ForbiddenException, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @UseGuards(AuthGuard)
    @Get('')
    async getUsers(@Req() req: Request) {
        const companyId = req.user.companyId;
        if (!companyId) { throw new ForbiddenException('Missing company scope') }
        return this.usersService.findAll(companyId);
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Req() req: Request, @Body() dto: CreateUserDto) {
        const adminUser = req['user']
        return this.usersService.createFromAdmin(dto, adminUser.sub)
    }

}
