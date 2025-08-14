import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UserPermissions } from './permissions.enum';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Post()
    async create(@Req() req: Request, @Body() dto: CreateUserDto) {
        const adminUser = req['user']
        return this.usersService.createUser(dto, adminUser.sub)
    }

    @Get()
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.usersService.findAll(admin.sub)
    }

    @Get(':id')
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.usersService.findOne(admin.sub, id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateUserDto) {
        const admin = req['user']
        return this.usersService.update(admin.sub, id, dto);
    }


    @Delete(':id')
    async remove(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.usersService.delete(admin.sub, id);
    }
}
