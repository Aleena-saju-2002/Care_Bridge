
import nodemailer from "nodemailer";

type OtpPurpose =
  | "user-registration"
  | "user-password-reset"
  | "hospital-registration"
  | "hospital-password-reset";

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;

const transporter =
  emailUser && emailPassword
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
      })
    : null;

const subjects: Record<OtpPurpose, string> = {
  "user-registration": "CareBridge Email Verification",
  "user-password-reset": "CareBridge Password Reset",
  "hospital-registration": "CareBridge Hospital Email Verification",
  "hospital-password-reset": "CareBridge Hospital Password Reset",
};

export async function sendOtpEmail(
  email: string,
  otp: string,
  purpose: OtpPurpose,
  expiryMinutes: number
): Promise<void> {
  if (!transporter || !emailUser) {
    throw new Error(
      "Email service is not configured. Check EMAIL_USER and EMAIL_PASSWORD."
    );
  }

  await transporter.sendMail({
    from: `"CareBridge" <${emailUser}>`,
    to: email,
    subject: subjects[purpose],
    text: `Your CareBridge OTP is ${otp}.

It expires in ${expiryMinutes} minutes.

Never share this code with anyone. If you did not request this code, ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px;">
        <h2 style="color: #2563EB;">CareBridge</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 6px;">${otp}</h1>
        <p>This OTP expires in ${expiryMinutes} minutes.</p>
        <p>Never share this code with anyone.</p>
      </div>
    `,
  });
}

// Compatibility wrapper for the existing HospitalService.
export async function sendHospitalOtp(
  email: string,
  otp: string,
  purpose: "registration" | "forgot-password"
): Promise<void> {
  return sendOtpEmail(
    email,
    otp,
    purpose === "registration"
      ? "hospital-registration"
      : "hospital-password-reset",
    10
  );
}
