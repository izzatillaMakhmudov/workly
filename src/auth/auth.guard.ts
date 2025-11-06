import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // console.log('Incoming Request Headers:', request.headers);
    // console.log('Incoming Request Cookies:', request.cookies);
    // ✅ Read token from cookie
    const token = request.cookies['token'];
    // console.log('Extracted Token:', token);
    if (!token) {
        // console.log('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      // ✅ Verify JWT
    //   console.log('Verifying token...');
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'your_jwt_secret_key', // make sure this matches your sign secret
      });
    //   console.log('Token Payload:', payload);

      // ✅ Attach user to request
      request.user = payload;
    //   console.log('Request User Set To:', request.user);
      return true;
    } catch (err) {
        // console.log('Token verification failed:', err);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}



// import {
//     CanActivate,
//     ExecutionContext,
//     Injectable,
//     UnauthorizedException
// } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { JwtService } from "@nestjs/jwt";
// import { Request } from "express";

// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(
//         private jwtService: JwtService,
//         private configService: ConfigService // inject properly
//     ) {}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest<Request>();
//         const token = this.extractTokenFromHeader(request);

//         if (!token) {
//             throw new UnauthorizedException('Authorization token not found');
//         }

//         try {
//             const payload = await this.jwtService.verifyAsync(
//                 token,
//                 {
//                     secret: this.configService.get<string>('JWT_SECRET')
//                 }
//             );

//             request.user = payload;
//         } catch (err) {
//             console.error('JWT Verification Failed:', err);
//             throw new UnauthorizedException('Invalid or expired token');
//         }

//         return true;
//     }

//     private extractTokenFromHeader(request: Request): string | undefined {
//         const [type, token] = request.headers['authorization']?.split(' ') || [];
//         return type === 'Bearer' ? token : undefined;
//     }
// }