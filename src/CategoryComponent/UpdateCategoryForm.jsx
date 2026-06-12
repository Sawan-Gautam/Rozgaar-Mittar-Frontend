import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const UpdateCategoryForm = () => {
  const location = useLocation();
  const category = location.state;
  const admin_jwtToken = sessionStorage.getItem("admin-jwtToken");
  let navigate = useNavigate();

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name must not exceed 50 characters")
      .required("Category name is required"),
    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .max(500, "Description must not exceed 500 characters")
      .required("Description is required"),
  });

  const formik = useFormik({
    initialValues: {
      id: category.id,
      name: category.name,
      description: category.description,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      saveCategory(values);
    },
  });

  const saveCategory = (data) => {

    fetch("http://localhost:8080/api/job/category/update", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + admin_jwtToken,
      },
      body: JSON.stringify(data),
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
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
              navigate("/admin/job/category/all");
            }, 2000); // Redirect after 3 seconds
          } else if (!res.success) {
            toast.error(res.responseMessage, {
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
            }, 2000); // Redirect after 3 seconds
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
            }, 2000); // Redirect after 3 seconds
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
        setTimeout(() => {
          window.location.reload(true);
        }, 1000);
      });
  };

  return (
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center">
        <div class="form-card border-color" style={{ width: "25rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 d-flex justify-content-center align-items-center"
              style={{
                borderRadius: "1em",
                height: "38px",
              }}
            >
              <h5 class="card-title">Update Job Category</h5>
            </div>
            <div class="card-body text-color mt-3">
              <form onSubmit={formik.handleSubmit}>
                <div class="mb-3">
                  <label for="title" class="form-label">
                    <b>Category Title</b>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    placeholder="enter title.."
                    name="name"
                    {...formik.getFieldProps("name")}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <small className="text-danger">{formik.errors.name}</small>
                  )}
                </div>
                <div class="mb-3">
                  <label for="description" class="form-label">
                    <b>Category Description</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    placeholder="enter description.."
                    name="description"
                    {...formik.getFieldProps("description")}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <small className="text-danger">{formik.errors.description}</small>
                  )}
                </div>

                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    class="btn bg-color custom-bg-text"
                  >
                    Update Category
                  </button>
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

export default UpdateCategoryForm;
