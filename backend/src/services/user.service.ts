
import bcrypt from "bcryptjs";

import IUserRepository from "../interfaces/repositories/user.repository.interface";

import IUserSignupDTO from "../dto/user/user-signup.dto";
import IUserLoginDTO from "../dto/user/user-login.dto";
import IVerifyOTPDTO from "../dto/user/verify-otp.dto";
import IForgotPasswordDTO from "../dto/user/forgot-password.dto";
import IVerifyForgotPasswordOTPDTO from "../dto/user/verify-forgot-password-otp.dto";
import IResetPasswordDTO from "../dto/user/reset-password.dto";

import logger from "../utils/logger";
import { generateToken } from "../utils/jwt";
import { generateOTP } from "../utils/otp";

import redisClient from "../config/redis";

import AppError from "../errors/app.error";
import { sendOtpEmail } from "./email.service";

class UserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  // User login
  async login(loginData: IUserLoginDTO) {
    const email = loginData.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(
      loginData.password,
      user.password
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    if (user.isBlocked) {
      throw new AppError("Your account has been blocked", 403);
    }

    if (!user.isVerified) {
      throw new AppError("Please verify your email before logging in", 403);
    }

    const token = generateToken(user._id.toString(), user.role);

    return { user, token };
  }

  // User registration
  async signup(signupData: IUserSignupDTO) {
    const email = signupData.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      logger.warn("Signup failed: email already exists");
      throw new AppError("Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(signupData.password, 10);

    const userData = {
      name: signupData.name.trim(),
      email,
      password: hashedPassword,
      dob: new Date(signupData.dob),
      isVerified: false,
      isBlocked: false,
    };

    const user = await this.userRepository.createUser(userData);
    const otp = generateOTP();

    await redisClient.set(`otp:${email}`, otp, { EX: 300 });

    try {
      await sendOtpEmail(email, otp, "user-registration", 5);
    } catch {
      await redisClient.del(`otp:${email}`);

      logger.error("Failed to send user registration OTP");

      throw new AppError(
        "Account created, but OTP email could not be sent. Please request a new OTP or contact support.",
        502
      );
    }

    if (process.env.NODE_ENV === "development") {
      logger.info(`Development OTP: ${otp}`);
    }

    logger.info("User registered and OTP email sent");

    return user;
  }

  // Verify registration OTP
  async verifyOTP(verifyData: IVerifyOTPDTO) {
    const email = verifyData.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isVerified) {
      throw new AppError("User is already verified", 400);
    }

    const storedOTP = await redisClient.get(`otp:${email}`);

    if (!storedOTP) {
      throw new AppError("OTP has expired or does not exist", 400);
    }

    if (storedOTP !== verifyData.otp) {
      throw new AppError("Invalid OTP", 400);
    }

    await this.userRepository.updateVerificationStatus(email, true);
    await redisClient.del(`otp:${email}`);

    logger.info("User verified successfully");

    return { message: "OTP verified successfully" };
  }

  // Request password-reset OTP
  async forgotPassword(forgotData: IForgotPasswordDTO): Promise<void> {
    const email = forgotData.email.trim().toLowerCase();

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const otp = generateOTP();

    await redisClient.set(`forgot-password:${email}`, otp, { EX: 300 });

    try {
      await sendOtpEmail(email, otp, "user-password-reset", 5);
    } catch {
      await redisClient.del(`forgot-password:${email}`);

      logger.error("Failed to send user password-reset OTP");

      throw new AppError(
        "Could not send password-reset OTP email. Please try again later.",
        502
      );
    }

    if (process.env.NODE_ENV === "development") {
      logger.info(`Development OTP: ${otp}`);
    }

    logger.info("Forgot-password OTP generated and email sent");
  }

  // Verify password-reset OTP
  async verifyForgotPasswordOtp(
    verifyData: IVerifyForgotPasswordOTPDTO
  ): Promise<void> {
    const email = verifyData.email.trim().toLowerCase();

    const storedOtp = await redisClient.get(`forgot-password:${email}`);

    if (!storedOtp) {
      throw new AppError("OTP expired or not found", 400);
    }

    if (storedOtp !== verifyData.otp) {
      throw new AppError("Invalid OTP", 400);
    }

    logger.info("Forgot-password OTP verified");
  }

  // Reset password
  async resetPassword(resetData: IResetPasswordDTO): Promise<void> {
    const email = resetData.email.trim().toLowerCase();

    const storedOtp = await redisClient.get(`forgot-password:${email}`);

    if (!storedOtp) {
      throw new AppError("OTP expired or not found", 400);
    }

    if (storedOtp !== resetData.otp) {
      throw new AppError("Invalid OTP", 400);
    }

    const hashedPassword = await bcrypt.hash(resetData.newPassword, 10);

    await this.userRepository.updatePassword(email, hashedPassword);
    await redisClient.del(`forgot-password:${email}`);

    logger.info("Password reset successfully");
  }
}

export default UserService;
