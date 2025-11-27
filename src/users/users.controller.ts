import { Body, Controller, Delete, ForbiddenException, Get, HttpStatus, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UserPermissions } from './permissions.enum';
import { UserGender, UserRole } from './user.entity';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
    constructor(private usersService: UsersService) { }


    @Post()
    @Permissions(UserPermissions.CREATE_USER)
    async create(@Req() req: Request, @Body() dto: CreateUserDto) {
        const adminUser = req['user']
        return this.usersService.createUser(dto, adminUser.sub, adminUser.role)
    }

    @Get('gender')
    getGender() {
        return Object.values(UserGender)
    }

    @Get('role')
    getRole(@Req() req: Request) {
        const admin = req['user']
        return this.usersService.returnRole(admin.sub, admin.role)
        // return Object.values(UserRole)

    }

    @Get('permissions')
    getPermissions() {
        return Object.values(UserPermissions)
    }

    @Get()
    @Permissions(UserPermissions.VIEW_USER)
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.usersService.findAll(admin.sub, admin.role)
    }

    @Get(':id')
    @Permissions(UserPermissions.VIEW_USER)
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user']
        return this.usersService.findOne(admin.sub, id, admin.role);
    }

    @Patch(':id')
    @Permissions(UserPermissions.UPDATE_USER)
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateUserDto) {
        const admin = req['user']
        return this.usersService.update(admin.sub, id, dto, admin.role);
    }


    @Delete(':id')
    @Permissions(UserPermissions.DELETE_USER)
    async remove(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const admin = req['user']
        await this.usersService.delete(admin.sub, id, admin.role);

        return res.status(HttpStatus.OK).json({ message: 'User deleted successfully' });
    }
}
