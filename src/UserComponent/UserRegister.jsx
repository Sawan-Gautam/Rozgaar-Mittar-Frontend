import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserRegister = () => {
  const navigate = useNavigate();

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userRole, setUserRole] = useState("");

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name must not exceed 30 characters")
      .required("First name is required"),
    lastName: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name must not exceed 30 characters")
      .required("Last name is required"),
    emailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
    phoneNo: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    street: Yup.string()
      .min(3, "Street must be at least 3 characters")
      .required("Street is required"),
    city: Yup.string()
      .min(2, "City must be at least 2 characters")
      .required("City is required"),
    state: Yup.string()
      .min(2, "State must be at least 2 characters")
      .required("State is required"),
    pincode: Yup.string()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    country: Yup.string()
      .min(2, "Country must be at least 2 characters")
      .required("Country is required"),
    otp: Yup.string().when("isOtpSent", {
      is: true,
      then: (schema) => schema
        .min(4, "OTP must be at least 4 characters")
        .required("OTP is required"),
    }),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      emailId: "",
      password: "",
      phoneNo: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
      otp: "",
      role: userRole,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveUser(values);
    },
  });

  useEffect(() => {
    if (document.URL.indexOf("employee") != -1) {
      setUserRole("Employee");
      formik.setFieldValue("role", "Employee");
    } else if (document.URL.indexOf("employer") != -1) {
      setUserRole("Employer");
      formik.setFieldValue("role", "Employer");
    }
  }, [document.URL]);

  const sendOtp = (e) => {
    e.preventDefault();

    if (!formik.values.emailId) {
      toast.error("Please enter email first", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formik.values.emailId)) {
      toast.error("Invalid Email ID", {
        position: "top-center",
        autoClose: 2000,
      });
      return;
    }

    fetch("http://localhost:8080/api/user/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId: formik.values.emailId }),
    })
      .then((result) => {
        if (!result.ok) {
          throw new Error("Backend Error");
        }
        return result.json();
      })
      .then((res) => {
        if (res.success) {
          toast.success("OTP sent to your email. Check Inbox/Spam.", {
            position: "top-center",
            autoClose: 2000,
          });
          setIsOtpSent(true);
        } else {
          toast.error(res.responseMessage, {
            position: "top-center",
            autoClose: 2000,
          });
        }
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        toast.error("Network Error", {
          position: "top-center",
          autoClose: 2000,
        });
      });
  };

  const saveUser = (values) => {
    if (!isOtpSent) {
      toast.error("Please verify email first!", {
        autoClose: 2000,
      });
      return;
    }

    if (!values.otp) {
      toast.error("Please enter OTP!", {
        autoClose: 2000,
      });
      return;
    }

    const userData = {
      ...values,
      role: userRole,
    };

    fetch("http://localhost:8080/api/user/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success("Registration Successful!", {
              autoClose: 2000,
            });
            setTimeout(() => {
              navigate("/user/login");
            }, 1000);
          } else {
            toast.error(res.responseMessage, {
              autoClose: 2000,
            });
          }
        });
      })
      .catch((error) => {
        toast.error("Server Error", {
          autoClose: 2000,
        });
      });
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center ms-2 me-2 mb-2">
        <div className="form-card border-color text-color" style={{ width: "50rem" }}>
          <div className="container-fluid">
            <div className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center" style={{ borderRadius: "1em", height: "45px" }}>
              <h5 className="card-title">
                {userRole === "Employee" ? "Employee Registration" : userRole === "Employer" ? "Employer Registration" : "Register Here!!!"}
              </h5>
            </div>
            <div className="card-body mt-3">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-6 mb-3 text-color">
                  <label className="form-label"><b>First Name</b></label>
                  <input type="text" className="form-control" name="firstName" {...formik.getFieldProps("firstName")} />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <small className="text-danger">{formik.errors.firstName}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3 text-color">
                  <label className="form-label"><b>Last Name</b></label>
                  <input type="text" className="form-control" name="lastName" {...formik.getFieldProps("lastName")} />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <small className="text-danger">{formik.errors.lastName}</small>
                  )}
                </div>

                {/* --- EMAIL SECTION WITH BUTTON --- */}
                <div className="col-md-6 mb-3 text-color">
                  <label className="form-label"><b>Email Id</b></label>
                  <div className="input-group">
                    <input type="email" className="form-control" name="emailId" {...formik.getFieldProps("emailId")} disabled={isOtpSent} />
                    {!isOtpSent && (
                      <button className="btn btn-warning" onClick={sendOtp}>Verify</button>
                    )}
                  </div>
                  {formik.touched.emailId && formik.errors.emailId && (
                    <small className="text-danger">{formik.errors.emailId}</small>
                  )}
                </div>

                {/* --- OTP SECTION (HIDDEN UNTIL EMAIL SENT) --- */}
                {isOtpSent && (
                  <div className="col-md-6 mb-3 text-color">
                    <label className="form-label"><b>Enter OTP</b></label>
                    <input type="text" className="form-control" name="otp" {...formik.getFieldProps("otp")} placeholder="Check your email for OTP" />
                    {formik.touched.otp && formik.errors.otp && (
                      <small className="text-danger">{formik.errors.otp}</small>
                    )}
                  </div>
                )}

                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Password</b></label>
                  <input type="password" className="form-control" name="password" {...formik.getFieldProps("password")} />
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-danger">{formik.errors.password}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Contact No</b></label>
                  <input type="text" className="form-control" name="phoneNo" {...formik.getFieldProps("phoneNo")} />
                  {formik.touched.phoneNo && formik.errors.phoneNo && (
                    <small className="text-danger">{formik.errors.phoneNo}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Street</b></label>
                  <textarea className="form-control" name="street" rows="3" {...formik.getFieldProps("street")} />
                  {formik.touched.street && formik.errors.street && (
                    <small className="text-danger">{formik.errors.street}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>City</b></label>
                  <input type="text" className="form-control" name="city" {...formik.getFieldProps("city")} />
                  {formik.touched.city && formik.errors.city && (
                    <small className="text-danger">{formik.errors.city}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>State</b></label>
                  <input type="text" className="form-control" name="state" {...formik.getFieldProps("state")} />
                  {formik.touched.state && formik.errors.state && (
                    <small className="text-danger">{formik.errors.state}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Pincode</b></label>
                  <input type="text" className="form-control" name="pincode" {...formik.getFieldProps("pincode")} />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <small className="text-danger">{formik.errors.pincode}</small>
                  )}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label"><b>Country</b></label>
                  <input type="text" className="form-control" name="country" {...formik.getFieldProps("country")} />
                  {formik.touched.country && formik.errors.country && (
                    <small className="text-danger">{formik.errors.country}</small>
                  )}
                </div>

                <div className="d-flex aligns-items-center justify-content-center">
                  <button type="submit" className="btn bg-color custom-bg-text">Register User</button>
                </div>
                <ToastContainer />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;

