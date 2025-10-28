import type { UserRoles } from "./models";

export interface AuthResponseDto {
  isAuthenticated: boolean;
  roles: UserRoles[];
  accessTokenExpiresIn: number;
}
