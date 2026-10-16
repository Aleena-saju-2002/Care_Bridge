
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createHash, randomInt } from "crypto";

import HospitalModel from "../models/hospital.model";
import HospitalRepository from "../repositories/hospital.repository";
import AppError from "../errors/app.error";
import logger from "../utils/logger";
import { sendHospitalOtp } from "./email.service";

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const OTP_EXPIRY_SECONDS = 600;
const RESET_VERIFICATION_WINDOW_MS = 10 * 60 * 1000;

type OtpPurpose = "registration" | "forgot-password";

type HospitalDocuments = Record<
  string,
  Express.Multer.File[] | undefined
>;

class HospitalService {
  private hospitalRepository: HospitalRepository;

  constructor(hospitalRepository: HospitalRepository) {
    this.hospitalRepository = hospitalRepository;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private generateOtp(): string {
    return randomInt(100000, 1000000).toString();
  }

  private hashOtp(otp: string): string {
    return createHash("sha256").update(otp).digest("hex");
  }

  private logDevelopmentOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ): void {
    if (process.env.NODE_ENV === "development") {
      logger.info(
        `[DEVELOPMENT ONLY] Hospital ${purpose} OTP for ${email}: ${otp}`
      );
    }
  }

  private async sendOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ): Promise<void> {
    await sendHospitalOtp(email, otp, purpose);
    this.logDevelopmentOtp(email, otp, purpose);
  }

  private publicHospital(hospital: any) {
    const data =
      typeof hospital.toObject === "function"
        ? hospital.toObject()
        : { ...hospital };

    delete data.password;
    delete data.accountNumber;
    delete data.otpHash;
    delete data.otpExpiresAt;
    delete data.otpPurpose;
    delete data.resetOtpVerifiedUntil;

    return data;
  }

  private async findHospitalWithSecrets(email: string) {
    return HospitalModel.findOne({
      representativeEmail: this.normalizeEmail(email),
    }).select(
      "+password +accountNumber +otpHash +otpExpiresAt +otpPurpose +resetOtpVerifiedUntil"
    );
  }

  private async findHospitalByIdWithSecrets(hospitalId: string) {
    return HospitalModel.findById(hospitalId).select(
      "+password +accountNumber +otpHash +otpExpiresAt +otpPurpose +resetOtpVerifiedUntil"
    );
  }

  private async saveOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ): Promise<void> {
    const hospital = await this.findHospitalWithSecrets(email);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    hospital.otpHash = this.hashOtp(otp);
    hospital.otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    hospital.otpPurpose = purpose;

    if (purpose === "forgot-password") {
      hospital.resetOtpVerifiedUntil = undefined;
    }

    await hospital.save();
  }

  private async validateOtp(
    email: string,
    otp: string,
    purpose: OtpPurpose
  ) {
    const hospital = await this.findHospitalWithSecrets(email);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    if (
      !hospital.otpHash ||
      !hospital.otpExpiresAt ||
      hospital.otpPurpose !== purpose
    ) {
      throw new AppError("OTP expired or not found", 400);
    }

    if (new Date(hospital.otpExpiresAt).getTime() < Date.now()) {
      throw new AppError("OTP has expired", 400);
    }

    if (this.hashOtp(otp) !== hospital.otpHash) {
      throw new AppError("Invalid OTP", 400);
    }

    return hospital;
  }

  // 1. Hospital registration
  async register(
    body: Record<string, any>,
    files: HospitalDocuments
  ) {
    const email = this.normalizeEmail(body.representativeEmail);

    const existingHospital = await this.findHospitalWithSecrets(email);

    if (existingHospital) {
      throw new AppError(
        "A hospital with this representative email already exists",
        409
      );
    }

    const existingRegistration = await HospitalModel.findOne({
      registrationNumber: String(body.registrationNumber).trim(),
    });

    if (existingRegistration) {
      throw new AppError(
        "Hospital registration number already exists",
        409
      );
    }

    const requiredFields = [
      "hospitalName",
      "registrationNumber",
      "yearEstablished",
      "phone",
      "address",
      "city",
      "district",
      "pincode",
      "state",
      "representativeName",
      "representativeDesignation",
      "representativePhone",
      "password",
      "accountHolderName",
      "bankName",
      "accountNumber",
      "ifscCode",
      "accountType",
    ];

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        String(body[field]).trim() === ""
      ) {
        throw new AppError(`${field} is required`, 400);
      }
    }

    if (!body.representativeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("A valid representative email is required", 400);
    }

    const requiredDocuments = [
      "registrationCertificate",
      "license",
      "idProof",
      "addressProof",
      "bankProof",
    ];

    for (const field of requiredDocuments) {
      if (!files?.[field]?.[0]) {
        throw new AppError(`${field} document is required`, 400);
      }
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);

    const documentPath = (field: string) =>
      files?.[field]?.[0]?.filename;

    const otp = this.generateOtp();

    const hospitalData = {
      ...body,
      representativeEmail: email,
      registrationNumber: String(body.registrationNumber).trim(),
      yearEstablished: Number(body.yearEstablished),
      password: hashedPassword,

      registrationCertificate: documentPath("registrationCertificate"),
      license: documentPath("license"),
      idProof: documentPath("idProof"),
      addressProof: documentPath("addressProof"),
      nabhCertificate: documentPath("nabhCertificate"),
      governmentCertificate: documentPath("governmentCertificate"),
      bankProof: documentPath("bankProof"),

      isEmailVerified: false,
      isBlocked: false,
      verificationStatus: "pending",
      rejectionReason: undefined,

      otpHash: this.hashOtp(otp),
      otpExpiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      otpPurpose: "registration",
      resetOtpVerifiedUntil: undefined,
    };

    const hospital = await HospitalModel.create(hospitalData);

    try {
      await this.sendOtp(email, otp, "registration");
    } catch {
      await HospitalModel.findByIdAndDelete(hospital._id);

      logger.error("Hospital registration OTP email could not be sent");

      throw new AppError(
        "Could not send the verification email. Please check the email configuration and try again.",
        502
      );
    }

    logger.info("Hospital registered; verification OTP email sent");

    return {
      message: "Hospital registered. Check your email for the OTP.",
      hospital: this.publicHospital(hospital),
    };
  }

  // 2. Verify registration OTP
  async verifyRegistrationOtp(email: string, otp: string) {
    const normalizedEmail = this.normalizeEmail(email);

    const hospital = await this.validateOtp(
      normalizedEmail,
      otp,
      "registration"
    );

    hospital.isEmailVerified = true;
    hospital.otpHash = undefined;
    hospital.otpExpiresAt = undefined;
    hospital.otpPurpose = undefined;

    await hospital.save();

    logger.info("Hospital email verified successfully");

    return {
      message: "Hospital email verified. Await admin approval.",
      hospital: this.publicHospital(hospital),
    };
  }

  // 3. Resend registration OTP
  async resendRegistrationOtp(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const hospital = await this.findHospitalWithSecrets(normalizedEmail);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    if (hospital.isEmailVerified) {
      throw new AppError("Hospital email is already verified", 400);
    }

    const otp = this.generateOtp();

    await this.saveOtp(normalizedEmail, otp, "registration");

    try {
      await this.sendOtp(normalizedEmail, otp, "registration");
    } catch {
      logger.error("Failed to resend hospital registration OTP");
      throw new AppError("Could not send OTP email. Please try again.", 502);
    }

    return { message: "A new verification OTP has been sent." };
  }

  // 4. Hospital login
  async login(email: string, password: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const hospital = await this.findHospitalWithSecrets(normalizedEmail);

    if (!hospital || !hospital.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordMatches = await bcrypt.compare(
      password,
      hospital.password
    );

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401);
    }

    if (hospital.isBlocked) {
      throw new AppError("Hospital account has been blocked", 403);
    }

    if (!hospital.isEmailVerified) {
      throw new AppError("Please verify your email before logging in", 403);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    const token = jwt.sign(
      {
        hospitalId: hospital._id.toString(),
        role: "hospital",
      },
      secret,
      { expiresIn: "1d" }
    );

    return {
      message:
        hospital.verificationStatus === "approved"
          ? "Login successful"
          : "Login successful. Hospital approval is pending or requires attention.",
      token,
      accessGranted: hospital.verificationStatus === "approved",
      hospital: this.publicHospital(hospital),
    };
  }

  // 5. Request forgot-password OTP
  async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);
    const hospital = await this.findHospitalWithSecrets(normalizedEmail);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    if (!hospital.isEmailVerified) {
      throw new AppError("Please verify your email first", 403);
    }

    const otp = this.generateOtp();

    await this.saveOtp(normalizedEmail, otp, "forgot-password");

    try {
      await this.sendOtp(normalizedEmail, otp, "forgot-password");
    } catch {
      const currentHospital =
        await this.findHospitalWithSecrets(normalizedEmail);

      if (currentHospital) {
        currentHospital.otpHash = undefined;
        currentHospital.otpExpiresAt = undefined;
        currentHospital.otpPurpose = undefined;
        currentHospital.resetOtpVerifiedUntil = undefined;
        await currentHospital.save();
      }

      logger.error("Hospital password-reset OTP email could not be sent");

      throw new AppError(
        "Could not send password-reset OTP email. Please try again.",
        502
      );
    }

    logger.info("Hospital password-reset OTP email sent");
  }

  // 6. Verify forgot-password OTP
  async verifyForgotPasswordOtp(
    email: string,
    otp: string
  ): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    const hospital = await this.validateOtp(
      normalizedEmail,
      otp,
      "forgot-password"
    );

    hospital.resetOtpVerifiedUntil = new Date(
      Date.now() + RESET_VERIFICATION_WINDOW_MS
    );

    await hospital.save();

    logger.info("Hospital password-reset OTP verified");
  }

  // 7. Reset password only after OTP verification
  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<void> {
    const normalizedEmail = this.normalizeEmail(email);

    const hospital = await this.findHospitalWithSecrets(normalizedEmail);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    if (
      hospital.otpPurpose !== "forgot-password" ||
      !hospital.otpHash ||
      !hospital.otpExpiresAt ||
      !hospital.resetOtpVerifiedUntil
    ) {
      throw new AppError(
        "Please verify the password-reset OTP first",
        400
      );
    }

    if (new Date(hospital.otpExpiresAt).getTime() < Date.now()) {
      throw new AppError("OTP has expired. Request a new OTP.", 400);
    }

    if (
      new Date(hospital.resetOtpVerifiedUntil).getTime() < Date.now()
    ) {
      throw new AppError(
        "OTP verification has expired. Verify a new OTP.",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    hospital.password = hashedPassword;
    hospital.otpHash = undefined;
    hospital.otpExpiresAt = undefined;
    hospital.otpPurpose = undefined;
    hospital.resetOtpVerifiedUntil = undefined;

    await hospital.save();

    logger.info("Hospital password reset successfully");
  }

  // 8. Get hospital status
  async getMyStatus(hospitalId: string) {
    const hospital = await this.findHospitalByIdWithSecrets(hospitalId);

    if (!hospital) {
      throw new AppError("Hospital not found", 404);
    }

    return {
      hospital: this.publicHospital(hospital),
      verificationStatus: hospital.verificationStatus,
      rejectionReason: hospital.rejectionReason,
      isEmailVerified: hospital.isEmailVerified,
      isBlocked: hospital.isBlocked,
    };
  }
}

export default HospitalService;
