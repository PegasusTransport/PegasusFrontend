import { defineStore } from "pinia";
import { userApi } from "@/endpoints/user";
import type { UserResponseDto } from "@/types/user-response-dto";
import { UserRoles } from "@/types/user-roles";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: null as UserResponseDto | null,
    };
  },
  actions: {
    async getUserProfile() {
      try {
        const response = await userApi.getUserProfile();
        this.user = response.data;
      } catch (error) {
        console.log(
          error instanceof Error
            ? error.message
            : "Something went wrong while trying to get user data"
        );
      }
    },

    loadRouteBasedOnRole() {
      const roles = this.user?.roles;
      const requiredRoles = [UserRoles.Admin, UserRoles.Driver, UserRoles.User];

      if (!roles || roles.length === 0) return "/login";
      if (requiredRoles.every((role) => roles.includes(role))) return "/admin";
      if (roles.includes(UserRoles.Admin)) return "/admin";
      if (roles.includes(UserRoles.Driver)) return "/driver";
      if (roles.includes(UserRoles.User)) return "/customer";
      return "/login";
    },
  },
});
