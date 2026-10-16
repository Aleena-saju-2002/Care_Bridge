import { Request, Response } from "express";
import HospitalService from "../services/hospital.service";
import HospitalModel from "../models/hospital.model";
import { HospitalRequest } from "../middleware/hospital-auth.middleware";
const hospitalService = new HospitalService();

function sendError(res: Response, error: unknown): void {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  const status = [
    "Invalid email or password",
    "Invalid or expired OTP",
    "Please verify your email before logging in",
    "Your hospital account has been blocked",
    "Verify the password-reset OTP first",
  ].includes(message)
    ? 400
    : 400;

  res.status(status).json({
    success: false,
    message,
  });
}

export async function registerHospital(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const files = req.files as
      | Record<string, Express.Multer.File[]>
      | undefined;

    const result = await hospitalService.register(
      req.body,
      files ?? {}
    );

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyRegistrationOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    const result = await hospitalService.verifyRegistrationOtp(
      String(email),
      String(otp)
    );

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function resendRegistrationOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const result = await hospitalService.resendRegistrationOtp(
      String(email)
    );

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function loginHospital(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const result = await hospitalService.login(
      String(email),
      String(password)
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    sendError(res, error);
  }
}

export async function forgotHospitalPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: "Email is required",
      });
      return;
    }

    const result = await hospitalService.forgotPassword(String(email));

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function verifyHospitalForgotPasswordOtp(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
      return;
    }

    const result = await hospitalService.verifyForgotPasswordOtp(
      String(email),
      String(otp)
    );

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function resetHospitalPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
      return;
    }

    const result = await hospitalService.resetPassword(
      String(email),
      String(newPassword)
    );

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function getHospitalStatus(
  req: HospitalRequest,
  res: Response
): Promise<void> {
  try {
    const result = await hospitalService.getMyStatus(
      req.hospitalId as string
    );

    res.json({ success: true, ...result });
  } catch (error) {
    sendError(res, error);
  }
}

export async function listHospitalsForAdmin(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const hospitals = await HospitalModel.find()
      .select("-password -accountNumber -otpHash -otpExpiresAt -otpPurpose -resetOtpVerifiedUntil")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: hospitals,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to fetch hospitals",
    });
  }
}

export async function approveHospital(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const hospital = await HospitalModel.findById(req.params.hospitalId);

    if (!hospital) {
      res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
      return;
    }

    if (!hospital.isEmailVerified) {
      res.status(400).json({
        success: false,
        message: "Verify the hospital email before approval",
      });
      return;
    }

    hospital.verificationStatus = "approved";
    hospital.rejectionReason = "";
    hospital.verifiedAt = new Date();

    // Set this to the authenticated admin's MongoDB ID
    // after integrating your existing admin auth middleware.
    await hospital.save();

    res.json({
      success: true,
      message: "Hospital approved successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to approve hospital",
    });
  }
}

export async function rejectHospital(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reason = String(req.body.rejectionReason ?? "").trim();

    if (!reason) {
      res.status(400).json({
        success: false,
        message: "A rejection reason is required",
      });
      return;
    }

    const hospital = await HospitalModel.findById(req.params.hospitalId);

    if (!hospital) {
      res.status(404).json({
        success: false,
        message: "Hospital not found",
      });
      return;
    }

    hospital.verificationStatus = "rejected";
    hospital.rejectionReason = reason;
    hospital.verifiedAt = new Date();

    await hospital.save();

    res.json({
      success: true,
      message: "Hospital rejected",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to reject hospital",
    });
  }
}