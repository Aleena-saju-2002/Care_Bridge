interface IResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

export default IResetPasswordDTO;