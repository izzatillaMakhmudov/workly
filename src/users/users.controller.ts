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


    @Post('create')
    async create(@Req() req: Request, @Body() dto: CreateUserDto) {
        const adminUser = req['user']
        return this.usersService.createFromAdmin(dto, adminUser.sub)
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: UpdateUserDto) {
        return this.usersService.update(id, dto);
    }

    @Get()
    async findAll(@Req() req: Request) {
        const admin = req['user']
        return this.usersService.findAll(admin.sub)
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }
}
