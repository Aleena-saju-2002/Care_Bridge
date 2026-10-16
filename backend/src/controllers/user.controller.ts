import { Request, Response } from "express";
import UserService from "../services/user.service";
import IUserSignupDTO from "../dto/user/user-signup.dto";
import IUserLoginDTO from "../dto/user/user-login.dto";
import IForgotPasswordDTO from "../dto/user/forgot-password.dto";
import IVerifyForgotPasswordOTPDTO from "../dto/user/verify-forgot-password-otp.dto";
import IResetPasswordDTO from "../dto/user/reset-password.dto";
import UserMapper from "../mappers/user.mapper";
import { successResponse } from "../utils/response";

class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

 async login(req: Request, res: Response) {
  const loginData: IUserLoginDTO = req.body;

  const result = await this.userService.login(loginData);

  const safeUser = UserMapper.toSafeUser(result.user);

  return res.status(200).json(
    successResponse("Login successful", {
      user: safeUser,
      token: result.token,
    })
  );
}

  async signup(req: Request, res: Response) {
  const signupData: IUserSignupDTO = req.body;

  const user = await this.userService.signup(signupData);

  const safeUser = UserMapper.toSafeUser(user);

  return res.status(201).json(
    successResponse("Signup successful", {
      user: safeUser,
    })
  );
}

verifyOTP = async (req: Request, res: Response) => {
  const result = await this.userService.verifyOTP(req.body);

  return res.status(200).json(
    successResponse(result.message)
  );
};

forgotPassword = async (req: Request, res: Response) => {
  const forgotData: IForgotPasswordDTO = req.body;

  await this.userService.forgotPassword(forgotData);

  return res.status(200).json(
    successResponse("OTP sent successfully")
  );
};

verifyForgotPasswordOtp = async (req: Request, res: Response) => {
  const verifyData: IVerifyForgotPasswordOTPDTO = req.body;

  await this.userService.verifyForgotPasswordOtp(verifyData);

  return res.status(200).json(
    successResponse("OTP verified successfully")
  );
};


resetPassword = async (req: Request, res: Response) => {
  const resetData: IResetPasswordDTO = req.body;

  await this.userService.resetPassword(resetData);

  return res.status(200).json(
    successResponse("Password reset successfully")
  );
};



}

export default UserController;