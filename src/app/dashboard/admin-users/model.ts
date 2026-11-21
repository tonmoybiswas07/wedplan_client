import type { DashboardRole } from "../sections";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: DashboardRole;
  blocked: boolean;
};

export const adminUsersPath = "/dashboard/admin/manage-users";
