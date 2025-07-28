import { User } from '../users/user.entity'; // adjust path to your User entity

declare module 'express' {
  export interface Request {
    user?: User & { sub?: number; role?: string; company?: any };
  }
}
