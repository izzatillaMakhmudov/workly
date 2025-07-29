import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService // inject properly
    ) { }

    async signIn(
        email: string,
        password: string):
        Promise<{ access_token: string }> {
        const user = await this.usersService.findOneByEmail(email);
        if (user?.password !== password) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            email: user.email,
            sub: user.id,
            companyId: user.company.id,
        };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            companyId: user.company?.id,
        };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

}
