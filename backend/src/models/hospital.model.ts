import { Schema, model } from "mongoose";
import IHospital from "../interfaces/models/hospital.interface";

const hospitalSchema = new Schema<IHospital>(
  {
    hospitalName: { type: String, required: true, trim: true },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    yearEstablished: { type: Number, required: true },
    website: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },

    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },

    representativeName: { type: String, required: true, trim: true },
    representativeDesignation: {
      type: String,
      required: true,
      trim: true,
    },
    representativePhone: {
      type: String,
      required: true,
      trim: true,
    },
    representativeEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },

    registrationCertificate: { type: String, required: true },
    license: { type: String, required: true },
    idProof: { type: String, required: true },
    addressProof: { type: String, required: true },
    nabhCertificate: String,
    governmentCertificate: String,

    accountHolderName: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, select: false },
    ifscCode: { type: String, required: true, uppercase: true, trim: true },
    accountType: {
      type: String,
      enum: ["savings", "current", "other"],
      required: true,
    },
    bankProof: { type: String, required: true },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: "" },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,

    otpHash: { type: String, select: false },
    otpExpiresAt: { type: Date, select: false },
    otpPurpose: { type: String, select: false },
    resetOtpVerifiedUntil: { type: Date, select: false },
  },
  { timestamps: true }
);

const HospitalModel = model<IHospital>("Hospital", hospitalSchema);

export default HospitalModel;