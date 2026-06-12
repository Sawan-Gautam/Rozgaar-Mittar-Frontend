import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddJobForm = () => {
  const [categories, setCategories] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [salaryRange, setSalaryRange] = useState([]);
  const [experience, setExperience] = useState([]);

  const employer = JSON.parse(sessionStorage.getItem("active-employer"));
  const employer_jwtToken = sessionStorage.getItem("employer-jwtToken");

  let navigate = useNavigate();

  const [selectedImage1, setSelectImage1] = useState(null);

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(3, "Job title must be at least 3 characters")
      .max(100, "Job title must not exceed 100 characters")
      .required("Job title is required"),
    companyName: Yup.string()
      .min(2, "Company name must be at least 2 characters")
      .max(50, "Company name must not exceed 50 characters")
      .required("Company name is required"),
    description: Yup.string()
      .min(20, "Description must be at least 20 characters")
      .max(1000, "Description must not exceed 1000 characters")
      .required("Job description is required"),
    requiredSkills: Yup.string()
      .min(5, "Skills must be at least 5 characters")
      .max(500, "Skills must not exceed 500 characters")
      .required("Required skills are required"),
    jobCategoryId: Yup.string()
      .required("Job category is required"),
    jobType: Yup.string()
      .required("Job type is required"),
    salaryRange: Yup.string()
      .required("Salary range is required"),
    experienceLevel: Yup.string()
      .required("Experience level is required"),
    street: Yup.string()
      .min(3, "Street must be at least 3 characters")
      .required("Street is required"),
    city: Yup.string()
      .min(2, "City must be at least 2 characters")
      .required("City is required"),
    pincode: Yup.string()
      .matches(/^\d{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    state: Yup.string()
      .min(2, "State must be at least 2 characters")
      .required("State is required"),
    country: Yup.string()
      .min(2, "Country must be at least 2 characters")
      .required("Country is required"),
  });

  const formik = useFormik({
    initialValues: {
      employerId: employer.id,
      jobCategoryId: "",
      title: "",
      description: "",
      companyName: "",
      jobType: "",
      salaryRange: "",
      experienceLevel: "",
      requiredSkills: "",
      street: "",
      city: "",
      pincode: "",
      state: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveJob(values);
    },
  });

  const retrieveAllCategories = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/job/category/fetch/all"
    );
    return response.data;
  };
  
  const retrieveAllJobTypes = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/helper/job/type/fetch/all"
    );
    return response.data;
  };
  
  const retrieveAllSalary = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/helper/job/salary/range/fetch/all"
    );
    return response.data;
  };

  const retrieveAllExperience = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/helper/job/expereince/fetch/all"
    );
    return response.data;
  };

  useEffect(() => {
    const getAllCategories = async () => {
      const resCategory = await retrieveAllCategories();
      if (resCategory) {
        setCategories(resCategory.categories);
      }
    };

    const getAllJobTypes = async () => {
      const res = await retrieveAllJobTypes();
      if (res) {
        setJobTypes(res);
      }
    };

    const getAllExperience = async () => {
      const res = await retrieveAllExperience();
      if (res) {
        setExperience(res);
      }
    };

    const getAllSalaryRange = async () => {
      const res = await retrieveAllSalary();
      if (res) {
        setSalaryRange(res);
      }
    };

    getAllExperience();
    getAllJobTypes();
    getAllSalaryRange();
    getAllCategories();
  }, []);

  const saveJob = (values) => {
    if (values === null || !selectedImage1) {
      toast.error("Please select company logo", {
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
    formData.append("employerId", values.employerId);
    formData.append("jobCategoryId", values.jobCategoryId);
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("companyName", values.companyName);
    formData.append("companyLogo", selectedImage1);
    formData.append("jobType", values.jobType);
    formData.append("salaryRange", values.salaryRange);
    formData.append("experienceLevel", values.experienceLevel);
    formData.append("requiredSkills", values.requiredSkills);
    formData.append("street", values.street);
    formData.append("city", values.city);
    formData.append("pincode", values.pincode);
    formData.append("state", values.state);
    formData.append("country", values.country);

    axios
      .post("http://localhost:8080/api/job/add", formData, {
        headers: {
          Authorization: "Bearer " + employer_jwtToken,
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
            navigate("/home");
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
              <h5 class="card-title">Add Job</h5>
            </div>
            <div class="card-body text-color">
              <form className="row g-3" onSubmit={formik.handleSubmit}>
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Job Title</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    {...formik.getFieldProps("title")}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <small className="text-danger">{formik.errors.title}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Company Name</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="companyName"
                    {...formik.getFieldProps("companyName")}
                  />
                  {formik.touched.companyName && formik.errors.companyName && (
                    <small className="text-danger">{formik.errors.companyName}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="description" className="form-label">
                    <b>Job Description</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="2"
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <small className="text-danger">{formik.errors.description}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="requiredSkills" className="form-label">
                    <b>Skills Required</b>
                  </label>
                  <textarea
                    className="form-control"
                    id="requiredSkills"
                    name="requiredSkills"
                    rows="2"
                    {...formik.getFieldProps("requiredSkills")}
                  />
                  {formik.touched.requiredSkills && formik.errors.requiredSkills && (
                    <small className="text-danger">{formik.errors.requiredSkills}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Job Category</b>
                  </label>

                  <select
                    name="jobCategoryId"
                    className="form-control"
                    {...formik.getFieldProps("jobCategoryId")}
                  >
                    <option value="">Select Job Category</option>

                    {categories.map((category) => {
                      return (
                        <option key={category.id} value={category.id}> {category.name} </option>
                      );
                    })}
                  </select>
                  {formik.touched.jobCategoryId && formik.errors.jobCategoryId && (
                    <small className="text-danger">{formik.errors.jobCategoryId}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Job Type</b>
                  </label>

                  <select
                    name="jobType"
                    className="form-control"
                    {...formik.getFieldProps("jobType")}
                  >
                    <option value="">Select Job Type</option>

                    {jobTypes.map((type) => {
                      return <option key={type} value={type}> {type} </option>;
                    })}
                  </select>
                  {formik.touched.jobType && formik.errors.jobType && (
                    <small className="text-danger">{formik.errors.jobType}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Salary Range</b>
                  </label>

                  <select
                    name="salaryRange"
                    className="form-control"
                    {...formik.getFieldProps("salaryRange")}
                  >
                    <option value="">Select Salary Range</option>

                    {salaryRange.map((range) => {
                      return <option key={range} value={range}> {range} </option>;
                    })}
                  </select>
                  {formik.touched.salaryRange && formik.errors.salaryRange && (
                    <small className="text-danger">{formik.errors.salaryRange}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Experience Required</b>
                  </label>

                  <select
                    name="experienceLevel"
                    className="form-control"
                    {...formik.getFieldProps("experienceLevel")}
                  >
                    <option value="">Select Experience Required</option>

                    {experience.map((exp) => {
                      return <option key={exp} value={exp}> {exp} </option>;
                    })}
                  </select>
                  {formik.touched.experienceLevel && formik.errors.experienceLevel && (
                    <small className="text-danger">{formik.errors.experienceLevel}</small>
                  )}
                </div>

                {/* Address Fields */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="street" className="form-label">
                    <b>Street</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="street"
                    name="street"
                    {...formik.getFieldProps("street")}
                  />
                  {formik.touched.street && formik.errors.street && (
                    <small className="text-danger">{formik.errors.street}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="city" className="form-label">
                    <b>City</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="city"
                    {...formik.getFieldProps("city")}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <small className="text-danger">{formik.errors.city}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="pincode" className="form-label">
                    <b>Pincode</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="pincode"
                    name="pincode"
                    {...formik.getFieldProps("pincode")}
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <small className="text-danger">{formik.errors.pincode}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="state" className="form-label">
                    <b>State</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="state"
                    name="state"
                    {...formik.getFieldProps("state")}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <small className="text-danger">{formik.errors.state}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="country" className="form-label">
                    <b>Country</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="country"
                    name="country"
                    {...formik.getFieldProps("country")}
                  />
                  {formik.touched.country && formik.errors.country && (
                    <small className="text-danger">{formik.errors.country}</small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Company Logo</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    name="companyLogo"
                    onChange={(e) => setSelectImage1(e.target.files[0])}
                    required
                  />
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    class="btn bg-color custom-bg-text"
                  >
                    Post Job
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

export default AddJobForm;
