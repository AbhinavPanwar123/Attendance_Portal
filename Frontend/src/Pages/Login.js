import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { signIn } from "../Redux/Slices/LoginSlice";
import { Vortex } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const Login = () => {
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const studentData = useSelector((state) => state?.login?.students[0]);

  const formik = useFormik({
    initialValues: {
      rollno: studentData?.rollno || "",
      password: "",
    },
    validationSchema: Yup.object({
      rollno: Yup.string()
        .required("Roll Number is required").length(7,'Roll Number must have 7 digits')
        .matches(/^[0-9]+$/, "Roll Number must be a number"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: async (values, action) => {
      setLoading(true); 
      try {
        const response = await axios.post("http://localhost:4000/api/login", {
          rollno: values.rollno,
          password: values.password,
        });

        if (response.data.success) {
          dispatch(signIn(values));
          action.resetForm();
          navigate("/studentPage");
        } else {
          console.log("Login failed:", response.data.message);
        }
      } catch (error) {
       console.error("Error in Sign In:",error)
       const message = error.response?.data?.message||error.message;
       toast.error(message);
      } finally {
        setLoading(false); 
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black">
     <ToastContainer/>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Student Login
        </h2>
        {loading ? (
          <div className="flex justify-center mb-6">
            <Vortex
              visible={true}
              height="80"
              width="80"
              ariaLabel="vortex-loading"
              wrapperStyle={{}}
              wrapperClass="vortex-wrapper"
              colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
            />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="rollno"
              >
                Roll Number
              </label>
              <input
                id="rollno"
                type="text"
                className={`w-full px-4 py-2 border ${
                  formik.touched.rollno && formik.errors.rollno
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.rollno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.rollno && formik.errors.rollno ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.rollno}
                </div>
              ) : null}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2 border ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
            >
              Login
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <a href="/forgot" className="text-black hover:underline">
            Forgot Password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <a href="/signUp" className="text-black hover:underline">
            Don’t have an account? Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
