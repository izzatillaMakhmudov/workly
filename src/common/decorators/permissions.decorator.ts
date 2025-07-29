import { SetMetadata } from "@nestjs/common";
import { UserPermissions } from "src/users/permissions.enum";

export const PERMISSIONS_KEY = 'permissions';

export const Permissions = (...permissions: UserPermissions[]) => {
    return SetMetadata(PERMISSIONS_KEY, permissions);
    
}