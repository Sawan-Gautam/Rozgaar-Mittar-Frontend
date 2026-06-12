import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateUserProfileForm = () => {
  const employee = JSON.parse(sessionStorage.getItem("active-employee"));
  const employee_jwtToken = sessionStorage.getItem("employee-jwtToken");

  let navigate = useNavigate();

  const [selectedImage1, setSelectImage1] = useState(null);
  const [selectedResume, setSelectResume] = useState(null);

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    bio: Yup.string()
      .min(10, "Bio must be at least 10 characters")
      .max(500, "Bio must not exceed 500 characters")
      .required("Bio is required"),
    website: Yup.string()
      .url("Website must be a valid URL")
      .required("Website is required"),
    githubProfileLink: Yup.string()
      .url("GitHub link must be a valid URL")
      .required("GitHub profile link is required"),
    linkedlnProfileLink: Yup.string()
      .url("LinkedIn link must be a valid URL")
      .required("LinkedIn profile link is required"),
  });

  const formik = useFormik({
    initialValues: {
      userId: employee.id,
      bio: "",
      website: "",
      linkedlnProfileLink: "",
      githubProfileLink: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveUserProfile(values);
    },
  });

  const saveUserProfile = (values) => {
    if (!selectedImage1 || !selectedResume) {
      toast.error("Please select both profile picture and resume", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    const formData = new FormData();
    formData.append("userId", values.userId);
    formData.append("bio", values.bio);
    formData.append("website", values.website);
    formData.append("githubProfileLink", values.githubProfileLink);
    formData.append("linkedlnProfileLink", values.linkedlnProfileLink);
    formData.append("resume", selectedResume);
    formData.append("profilePic", selectedImage1);

    axios
      .put("http://localhost:8080/api/user/profile/add", formData, {
        headers: {
          Authorization: "Bearer " + employee_jwtToken,
        },
      })
      .then((resp) => {
        let response = resp.data;

        if (response.success) {
          toast.success(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          setTimeout(() => {
            navigate("/employee/profile/detail");
          }, 2000);
        } else if (!response.success) {
          toast.error(response.responseMessage, {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        } else {
          toast.error("It Seems Server is down!!!", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            window.location.reload(true);
          }, 2000);
        }
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
        setTimeout(() => {
          window.location.reload(true);
        }, 2000);
      });
  };

  return (
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center mb-4">
        <div class="card form-card shadow-lg" style={{ width: "60rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{
                borderRadius: "1em",
                height: "45px",
              }}
            >
              <h5 class="card-title">Update Profile</h5>
            </div>
            <div class="card-body text-color">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-6 mb-3">
                  <label htmlFor="bio" className="form-label">
                    <b>Bio</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bio"
                    name="bio"
                    {...formik.getFieldProps("bio")}
                  />
                  {formik.touched.bio && formik.errors.bio && (
                    <small className="text-danger">{formik.errors.bio}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Website</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="website"
                    {...formik.getFieldProps("website")}
                  />
                  {formik.touched.website && formik.errors.website && (
                    <small className="text-danger">{formik.errors.website}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Github Link</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="githubProfileLink"
                    {...formik.getFieldProps("githubProfileLink")}
                  />
                  {formik.touched.githubProfileLink && formik.errors.githubProfileLink && (
                    <small className="text-danger">{formik.errors.githubProfileLink}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>LinkedIn Profile Link</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="linkedlnProfileLink"
                    {...formik.getFieldProps("linkedlnProfileLink")}
                  />
                  {formik.touched.linkedlnProfileLink && formik.errors.linkedlnProfileLink && (
                    <small className="text-danger">{formik.errors.linkedlnProfileLink}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Profile Pic</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    name="profilePic"
                    onChange={(e) => setSelectImage1(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Resume</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    name="resume"
                    onChange={(e) => setSelectResume(e.target.files[0])}
                    required
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    class="btn bg-color custom-bg-text"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserProfileForm;
