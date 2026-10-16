import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import HospitalModel from "../models/hospital.model";

export interface HospitalRequest extends Request {
  hospitalId?: string;
}

export async function requireHospital(
  req: HospitalRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      decoded.role !== "hospital" ||
      typeof decoded.hospitalId !== "string"
    ) {
      res.status(403).json({
        success: false,
        message: "Invalid hospital token",
      });
      return;
    }

    const hospital = await HospitalModel.findById(decoded.hospitalId);

    if (!hospital || hospital.isBlocked || !hospital.isEmailVerified) {
      res.status(403).json({
        success: false,
        message: "Hospital access is unavailable",
      });
      return;
    }

    req.hospitalId = hospital._id.toString();
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}

export async function requireApprovedHospital(
  req: HospitalRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const hospital = req.hospitalId
      ? await HospitalModel.findById(req.hospitalId)
      : null;

    if (!hospital) {
      res.status(401).json({
        success: false,
        message: "Hospital not found",
      });
      return;
    }

    if (hospital.verificationStatus !== "approved") {
      res.status(403).json({
        success: false,
        message: "Hospital verification is pending or not approved",
        verificationStatus: hospital.verificationStatus,
        rejectionReason: hospital.rejectionReason,
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({
      success: false,
      message: "Unable to verify hospital status",
    });
  }
}