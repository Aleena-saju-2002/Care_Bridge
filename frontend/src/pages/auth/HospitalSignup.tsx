import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { registerHospital } from "../../services/hospital.service";
import "./HospitalSignup.css";

const textFields = [
  ["hospitalName", "Hospital name"],
  ["registrationNumber", "Registration number"],
  ["yearEstablished", "Year established"],
  ["website", "Website (optional)"],
  ["phone", "Hospital phone"],
  ["address", "Full address"],
  ["city", "City"],
  ["district", "District"],
  ["pincode", "PIN code"],
  ["state", "State"],
  ["representativeName", "Representative name"],
  ["representativeDesignation", "Representative designation"],
  ["representativePhone", "Representative phone"],
  ["representativeEmail", "Representative email"],
  ["password", "Password"],
  ["accountHolderName", "Bank account holder name"],
  ["bankName", "Bank name"],
  ["accountNumber", "Bank account number"],
  ["ifscCode", "IFSC code"],
] as const;

const documentFields = [
  ["registrationCertificate", "Registration certificate", true],
  ["license", "Hospital license", true],
  ["idProof", "Representative ID proof", true],
  ["addressProof", "Hospital address proof", true],
  ["nabhCertificate", "NABH certificate (optional)", false],
  ["governmentCertificate", "Government certificate (optional)", false],
  ["bankProof", "Bank proof", true],
] as const;

function HospitalSignup() {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({
    accountType: "savings",
  });

  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.password.length < 6) {
      toast.warning("Password must contain at least 6 characters.");
      return;
    }

    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value.trim());
    });

    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      setLoading(true);
      await registerHospital(formData);

      toast.success("Registration successful. Check your email for OTP.");

      navigate("/hospital/verify-otp", {
        state: { email: values.representativeEmail.trim() },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Hospital registration failed."
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hospital-signup-container">
  <section className="hospital-signup-form">
        <div className="signup-header">
          <h1>CareBridge</h1>
          <h2>Hospital Registration</h2>
          <p>Submit your hospital details for verification.</p>
        </div>

<form onSubmit={handleSubmit}>
            <h3>Hospital details</h3>

          {textFields.map(([name, label]) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                type={
                  name === "password"
                    ? "password"
                    : name === "representativeEmail"
                    ? "email"
                    : name === "yearEstablished"
                    ? "number"
                    : "text"
                }
                required={
                  name !== "website"
                }
                min={name === "yearEstablished" ? 1800 : undefined}
                value={values[name] ?? ""}
                onChange={(event) =>
                  setValues((previous) => ({
                    ...previous,
                    [name]: event.target.value,
                  }))
                }
                placeholder={`Enter ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="accountType">Account type</label>
            <select
              id="accountType"
              required
              value={values.accountType}
              onChange={(event) =>
                setValues((previous) => ({
                  ...previous,
                  accountType: event.target.value,
                }))
              }
            >
              <option value="savings">Savings</option>
              <option value="current">Current</option>
              <option value="other">Other</option>
            </select>
          </div>

          <h3>Required documents</h3>
          <p className="document-help">
            Upload PDF, JPG or PNG files. Maximum 5 MB per file.
          </p>

          {documentFields.map(([name, label, required]) => (
            <div className="form-group" key={name}>
              <label htmlFor={name}>{label}</label>
              <input
                id={name}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                required={required}
                onChange={(event) =>
                  setFiles((previous) => ({
                    ...previous,
                    [name]: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
          ))}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Register Hospital"}
          </button>
        </form>

        <div className="login-link">
  Already registered?{" "}
  <button type="button" onClick={() => navigate("/login")}>
    Login
  </button>
</div>
      </section>
    </main>
  );
}

export default HospitalSignup;