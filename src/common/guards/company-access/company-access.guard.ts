import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';


@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private reflector: Reflector) { }


  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    const companyIdFromParam = parseInt(request.params.companyId || request.params.id, 10);

    if (!user || !user.companyId) {
      throw new ForbiddenException('Unauthorized: No company scope');
    }

    if (isNaN(companyIdFromParam)) {
      return true;
    }

    if (companyIdFromParam !== user.companyId) {
      throw new ForbiddenException('Unauthorized: Company ID mismatch');
    }

    return true;
  }
}
