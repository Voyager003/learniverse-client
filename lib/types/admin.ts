import type { PaginationQuery } from './api';
import { Role } from './enums';

export interface AdminUserQuery extends PaginationQuery {
  search?: string;
  role?: Role;
  isActive?: boolean;
}

export interface UpdateAdminUserStatusRequest {
  isActive: boolean;
  reason?: string;
}

export interface UpdateAdminUserRoleRequest {
  role: Role;
  reason?: string;
}
