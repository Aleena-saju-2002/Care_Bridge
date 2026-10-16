import { Router } from "express";

import {
  registerHospital,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  loginHospital,
  forgotHospitalPassword,
  verifyHospitalForgotPasswordOtp,
  resetHospitalPassword,
  getHospitalStatus,
  listHospitalsForAdmin,
  approveHospital,
  rejectHospital,
} from "../controllers/hospital.controller";

import { hospitalDocuments } from "../middleware/hospital-upload.middleware";

import {
  requireHospital,
} from "../middleware/hospital-auth.middleware";

import { requireHospitalAdmin } from "../middleware/hospital-admin.middleware";

const router = Router();

// Registration and email verification
router.post(
  "/register",
  hospitalDocuments,
  registerHospital
);

router.post("/verify-otp", verifyRegistrationOtp);
router.post("/resend-otp", resendRegistrationOtp);

// Login and password recovery
router.post("/login", loginHospital);
router.post("/forgot-password", forgotHospitalPassword);
router.post(
  "/verify-forgot-password-otp",
  verifyHospitalForgotPasswordOtp
);
router.post("/reset-password", resetHospitalPassword);

// Any verified, non-blocked hospital can view its status,
// including hospitals that are pending or rejected.
router.get("/me/status", requireHospital, getHospitalStatus);

// Admin-only hospital review
router.get(
  "/admin/list",
  requireHospitalAdmin,
  listHospitalsForAdmin
);

router.patch(
  "/admin/:hospitalId/approve",
  requireHospitalAdmin,
  approveHospital
);

router.patch(
  "/admin/:hospitalId/reject",
  requireHospitalAdmin,
  rejectHospital
);

// Example for future protected hospital features:
// router.post(
//   "/medical-requests",
//   requireHospital,
//   requireApprovedHospital,
//   createMedicalRequest
// );

export default router;