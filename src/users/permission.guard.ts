import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import { UserPermissions } from "./permissions.enum";
import { Reflector } from "@nestjs/core";
import { PERMISSIONS_KEY } from "src/common/decorators/permissions.decorator";

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {

        const requiredPermissions = this.reflector.getAllAndOverride<UserPermissions[]>(
            PERMISSIONS_KEY,
            [context.getHandler(), context.getClass()]
        )

        if (!requiredPermissions) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user || !user.permissions) {
            throw new ForbiddenException("User permissions not found");
        }

        if (user.role === 'super_admin') return true;

        const companyPermissions = [
            UserPermissions.CREATE_COMPANY,
            UserPermissions.UPDATE_COMPANY,
            UserPermissions.DELETE_COMPANY,
            UserPermissions.VIEW_COMPANY
        ];

        if (
            user.role === 'company_admin' &&
            companyPermissions.every(p => !requiredPermissions.includes(p))
        ) {
            return true;
        }

        const hasPermission = requiredPermissions.every((p) =>
            user.permissions.includes(p)
        )

        if (!hasPermission) {
            throw new ForbiddenException(
                `You do not have permission to access this resource.`
            );
        }

        return true;
    }

}