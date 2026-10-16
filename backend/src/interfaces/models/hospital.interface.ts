import { Document, Types } from "mongoose";

export type VerificationStatus =
  | "pending"
  | "approved"
  | "rejected";

export default interface IHospital extends Document {
  hospitalName: string;
  registrationNumber: string;
  yearEstablished: number;
  website?: string;
  phone: string;

  address: string;
  city: string;
  district: string;
  pincode: string;
  state: string;

  representativeName: string;
  representativeDesignation: string;
  representativePhone: string;
  representativeEmail: string;

  password: string;
  isEmailVerified: boolean;
  isBlocked: boolean;

  registrationCertificate: string;
  license: string;
  idProof: string;
  addressProof: string;
  nabhCertificate?: string;
  governmentCertificate?: string;

  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: "savings" | "current" | "other";
  bankProof: string;

  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedBy?: Types.ObjectId;
  verifiedAt?: Date;

  otpHash?: string;
  otpExpiresAt?: Date;
  otpPurpose?: "registration" | "forgot-password";
  resetOtpVerifiedUntil?: Date;

  createdAt: Date;
  updatedAt: Date;
}