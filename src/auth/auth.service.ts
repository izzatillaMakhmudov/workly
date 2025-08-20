import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { permission } from 'process';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from "bcrypt";



@Injectable()
export class AuthService {
    
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService // inject properly
    ) {
      
    }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new UnauthorizedException('User not found')
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            email: user.email,
            sub: user.id,
            companyId: user.company.id,
            permissions: user.permissions,
            role: user.role
        };
        return {
            access_token: await this.jwtService.signAsync(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

}
