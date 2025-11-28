import { Body, Controller, Delete, Get, HttpStatus, Inject, Param, Patch, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request, Response } from 'express';
import { ShiftsService } from './shifts.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { PermissionGuard } from 'src/users/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { UserPermissions } from 'src/users/permissions.enum';

@Controller('shifts')
@UseGuards(AuthGuard, PermissionGuard)
export class ShiftsController {
    constructor(
        private readonly shiftsService: ShiftsService,
    ) { }

    @Get('')
    @Permissions(UserPermissions.VIEW_SHIFT)
    async fidAll(@Req() req: Request) {
        const admin = req['user'];
        return this.shiftsService.findAll(admin.sub, admin.role);
    }

    @Get(':id')
    @Permissions(UserPermissions.VIEW_SHIFT)
    async findOne(@Param('id') id: number, @Req() req: Request) {
        const admin = req['user'];
        return this.shiftsService.findOne(admin.sub, id, admin.role);
    }

    @Get('company/:companyId')
    async findByCompany(@Param('companyId') companyId: number, @Req() req: Request) {
        const admin = req['user'];
        return this.shiftsService.getShiftsByCompany(companyId);
    }

    @Post('')
    @Permissions(UserPermissions.CREATE_SHIFT)
    async createShift(@Req() req: Request, @Body() dto: CreateShiftDto) {
        const admin = req['user'];
        return this.shiftsService.createShift(dto, admin.sub, admin.role);
    }

    @Delete(':id')
    @Permissions(UserPermissions.DELETE_SHIFT)
    async remove(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        const admin = req['user'];
        await this.shiftsService.delete(admin.sub, id, admin.role);

        return res.status(HttpStatus.OK).json({ message: 'Shift deleted successfully' });
    }

    @Patch(':id')
    @Permissions(UserPermissions.UPDATE_SHIFT)
    async update(@Param('id') id: number, @Req() req: Request, @Body() dto: UpdateShiftDto) {
        const admin = req['user'];
        return this.shiftsService.update(admin.sub, id, dto, admin.role);
    }

}
