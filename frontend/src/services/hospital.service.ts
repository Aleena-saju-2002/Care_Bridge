import api from "./api";

export interface HospitalRegistrationData {
  hospitalName: string;
  registrationNumber: string;
  yearEstablished: string;
  website: string;
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
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: string;
}

export const registerHospital = (data: FormData) =>
  api.post("/hospitals/register", data);

export const verifyHospitalOtp = (email: string, otp: string) =>
  api.post("/hospitals/verify-otp", { email, otp });

export const resendHospitalOtp = (email: string) =>
  api.post("/hospitals/resend-otp", { email });

export const loginHospital = (email: string, password: string) =>
  api.post("/hospitals/login", { email, password });

export const getHospitalStatus = () =>
  api.get("/hospitals/me/status");