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
    
    const token = request.cookies['token'];
    
    if (!token) {
        
      throw new UnauthorizedException('No token provided');
    }

    try {
      
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'your_jwt_secret_key', 
      });
    
      request.user = payload;

      return true;
    } catch (err) {

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