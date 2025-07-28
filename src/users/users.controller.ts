import { Controller, ForbiddenException, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

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

}
