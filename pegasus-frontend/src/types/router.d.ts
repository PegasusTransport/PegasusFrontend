import "vue-router";
import { UserRoles } from "@/types/user-roles";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    guestOnly?: boolean;
    requiredRole?: UserRoles;
  }
}
