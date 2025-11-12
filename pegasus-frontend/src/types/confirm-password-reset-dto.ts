export interface ConfirmPasswordResetDto {
  email: string;
  token: string;
  newPassword: string;
}
