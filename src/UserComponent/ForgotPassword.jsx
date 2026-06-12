import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  // we have 3 steps: 1=Email, 2=OTP, 3=New Password
  const [step, setStep] = useState(1);

  const [email, setEmail]           = useState("");
  const [otp, setOtp]               = useState("");
  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]       = useState(false);

  // =====================
  // STEP 1 — Email submit
  // =====================
  const handleSendOtp = () => {
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    setLoading(true);

    fetch("http://localhost:8080/api/user/forgot-password/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId: email }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          toast.success(data.responseMessage);
          setStep(2); // got to the OTP
        } else {
          toast.error(data.responseMessage);
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Server error. Please try again.");
      });
  };

  // =====================
  // STEP 2 — OTP verify + New Password submit
  // =====================
  const handleResetPassword = () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    fetch("http://localhost:8080/api/user/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        emailId: email,
        otp: otp,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          toast.success(data.responseMessage);
          setStep(3); // Success step
          setTimeout(() => navigate("/user/login"), 2000);
        } else {
          toast.error(data.responseMessage);
        }
      })
      .catch(() => {
        setLoading(false);
        toast.error("Server error. Please try again.");
      });
  };

  return (
    <div className="mt-4 d-flex justify-content-center align-items-center">
      <div className="form-card border-color" style={{ width: "25rem" }}>
        <div className="container-fluid">

          {/* Header */}
          <div
            className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
            style={{ borderRadius: "1em", height: "38px" }}
          >
            <h4 className="card-title">Forgot Password</h4>
          </div>

          <div className="card-body mt-3">

            {/* STEP 1 — Email */}
            {step === 1 && (
              <div>
                <p className="text-color text-center">
                  Enter your registered email — we'll send you an OTP.
                </p>
                <div className="mb-3 text-color">
                  <label className="form-label"><b>Email Id</b></label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-center mb-2">
                  <button
                    className="btn bg-color custom-bg-text"
                    onClick={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/user/login")}
                  >
                    Back to Login
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2 — OTP + New Password */}
            {step === 2 && (
              <div>
                <p className="text-color text-center">
                  OTP sent to <b>{email}</b>
                </p>
                <div className="mb-3 text-color">
                  <label className="form-label"><b>Enter OTP</b></label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="6-digit OTP"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="mb-3 text-color">
                  <label className="form-label"><b>New Password</b></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3 text-color">
                  <label className="form-label"><b>Confirm Password</b></label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-center mb-2">
                  <button
                    className="btn bg-color custom-bg-text"
                    onClick={handleResetPassword}
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
                <div className="text-center mt-2">
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setStep(1)}
                  >
                    Wrong email? Go back
                  </span>
                </div>
              </div>
            )}

            {/* STEP 3 — Success */}
            {step === 3 && (
              <div className="text-center py-3">
                <h5 className="text-success">Password Reset Successfully!</h5>
                <p className="text-color">Redirecting to login page...</p>
              </div>
            )}

          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;