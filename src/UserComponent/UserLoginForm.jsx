import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserLoginForm = () => {
  let navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    emailId: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string()
      .notOneOf(["0"], "Please select a valid role")
      .required("User role is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailId: "",
      password: "",
      role: "0",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      loginAction(values);
    },
  });

  const loginAction = (loginRequest) => {
    fetch("http://localhost:8080/api/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((result) => {
        console.log("result", result);
        result.json().then((res) => {
          if (res.success) {
            console.log("Got the success response");

            if (res.jwtToken !== null) {
              if (res.user.role === "Admin") {
                sessionStorage.setItem(
                  "active-admin",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("admin-jwtToken", res.jwtToken);
              } else if (res.user.role === "Employer") {
                sessionStorage.setItem(
                  "active-employer",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("employer-jwtToken", res.jwtToken);
              } else if (res.user.role === "Employee") {
                sessionStorage.setItem(
                  "active-employee",
                  JSON.stringify(res.user)
                );
                sessionStorage.setItem("employee-jwtToken", res.jwtToken);
              }
            }

            if (res.jwtToken !== null) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setTimeout(() => {
                window.location.href = "/home";
              }, 1000); // Redirect after 3 seconds
            } else {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            }
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("It seems server is down", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <div>
      <div className="mt-2 d-flex aligns-items-center justify-content-center">
        <div className="form-card border-color" style={{ width: "25rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "1em",
                height: "38px",
              }}
            >
              <h4 className="card-title">User Login</h4>
            </div>
            <div className="card-body mt-3">
              <form onSubmit={formik.handleSubmit}>
                <div class="mb-3 text-color">
                  <label for="role" class="form-label">
                    <b>User Role</b>
                  </label>
                  <select
                    className="form-control"
                    name="role"
                    {...formik.getFieldProps("role")}
                  >
                    <option value="0">Select Role</option>
                    <option value="Admin"> Admin </option>
                    <option value="Employer"> Employer </option>
                    <option value="Employee"> Employee </option>
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <small className="text-danger">{formik.errors.role}</small>
                  )}
                </div>

                <div className="mb-3 text-color">
                  <label for="emailId" class="form-label">
                    <b>Email Id</b>
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="emailId"
                    name="emailId"
                    {...formik.getFieldProps("emailId")}
                  />
                  {formik.touched.emailId && formik.errors.emailId && (
                    <small className="text-danger">{formik.errors.emailId}</small>
                  )}
                </div>
                <div className="mb-3 text-color">
                  <label for="password" className="form-label">
                    <b>Password</b>
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    {...formik.getFieldProps("password")}
                    autoComplete="on"
                  />
                  {formik.touched.password && formik.errors.password && (
                    <small className="text-danger">{formik.errors.password}</small>
                  )}
                </div>
                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    className="btn bg-color custom-bg-text"
                  >
                    Login
                  </button>
                  <ToastContainer />
                </div>
                <div className="text-center mt-2 mb-2">
                <span
                  className="text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/user/forgot-password")}
                >
                  Forgot Password?
                </span>
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginForm;
