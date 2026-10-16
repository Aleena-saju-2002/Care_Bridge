
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "../pages/LandingPage";

import Signup from "../pages/auth/Signup";
import UserSignup from "../pages/auth/UserSignup";
import Login from "../pages/auth/Login";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyForgotPasswordOtp from "../pages/auth/VerifyForgotPasswordOtp";
import ResetPassword from "../pages/auth/ResetPassword";
import HospitalSignup from "../pages/auth/HospitalSignup";
import HospitalVerifyOtp from "../pages/auth/VerifyHospitalOtp";

import UserDashboard from "../pages/user/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import HospitalDashboard from "../pages/hospital/HospitalDashboard";

import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/user" element={<UserSignup />} />
        <Route path="/signup/hospital" element={<HospitalSignup />} />

        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/verify-forgot-password-otp"
          element={<VerifyForgotPasswordOtp />}
        />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/hospital/verify-otp" element={<HospitalVerifyOtp />} />

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user" element={<UserDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["hospital"]} />}>
          <Route path="/hospital" element={<HospitalDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
