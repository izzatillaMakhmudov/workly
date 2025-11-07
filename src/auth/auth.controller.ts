import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }


    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(
        @Body() signInDto: Record<string, any>,
        @Res({ passthrough: true }) res: Response
    ) {
        const { access_token } = await this.authService.signIn(
            signInDto.email,
            signInDto.password,
        );


        res.cookie('token', access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
        });
        return { message: 'Login successful' };
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return { user: req.user };
    }


    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token');
        return { message: 'Logged out' };
    }




}
