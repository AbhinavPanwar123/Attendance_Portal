import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { Register } from "../Redux/Slices/RegisterSlice";
import { Vortex } from "react-loader-spinner";

const Signup = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const studentData = useSelector((state) => state?.register?.students[0]);

  const formik = useFormik({
    initialValues: {
      name: studentData?.name || "",
      rollno: studentData?.rollno || "",
      className: studentData?.className || "",
      password: "",
      confirmPassword: "",
      image: null, // Add image to the initial values
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      rollno: Yup.string()
        .required("Roll Number is required")
        .matches(/^[0-9]+$/, "Roll Number must be a number"),
      className: Yup.string()
        .max(2, "Class Name should be in no. and it contains max. 2 digits")
        .required("Class Name is required"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      image: Yup.mixed()
        .required("Profile Picture is required")
        .test("fileSize", "The file is too large", (value) => {
          return value && value.size <= 5 * 1024 * 1024; // Max file size is 5MB
        })
        .test("fileType", "Only JPG, PNG, and GIF files are allowed", (value) => {
          return (
            value &&
            ["image/jpeg", "image/png", "image/gif"].includes(value.type)
          );
        }),
    }),
    onSubmit: async (values, action) => {
      setLoading(true);
      try {
        const formData = new FormData();
        if (file) {
          formData.append("image", file);
        }
        formData.append("name", values.name);
        formData.append("rollno", values.rollno);
        formData.append("className", values.className);
        formData.append("password", values.password);
        formData.append("confirmPassword", values.confirmPassword);

        // Upload the image and get the path
        const responseImg = await axios.post("http://localhost:4000/api/upload", formData);
        const imagePath = responseImg.data.filePath;

        // Now add the student data along with the image path to the database
        const response = await axios.post("http://localhost:4000/api/addStudent", {
          ...values,
          image: imagePath,
        });

        if (response.data.success) {
          dispatch(Register({ ...values, image: imagePath }));
          action.resetForm();
          navigate("/");
        } else {
          console.log("Signup failed:", response.data.message);
        }
      } catch (error) {
        console.error("Error during signup:", error.message);
      } finally {
        setLoading(false);
      }
    },
  });

  const handleFileChange = (event) => {
    const selectedFile = event.currentTarget.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      formik.setFieldValue("image", selectedFile); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Student Signup</h2>
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
            {/* Form fields here */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                type="text"
                className={`w-full px-4 py-2 border ${
                  formik.touched.name && formik.errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="rollno">
                Roll Number
              </label>
              <input
                id="rollno"
                type="text"
                className={`w-full px-4 py-2 border ${
                  formik.touched.rollno && formik.errors.rollno ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.rollno}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.rollno && formik.errors.rollno ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.rollno}</div>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="className">
                Class Name
              </label>
              <input
                id="className"
                type="text"
                className={`w-full px-4 py-2 border ${
                  formik.touched.className && formik.errors.className ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.className}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.className && formik.errors.className ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.className}</div>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full px-4 py-2 border ${
                  formik.touched.password && formik.errors.password ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`w-full px-4 py-2 border ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.confirmPassword}</div>
              ) : null}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="image">
                Profile Picture
              </label>
              <input
                id="image"
                type="file"
                className={`w-full px-4 py-2 border ${
                  formik.touched.image && formik.errors.image ? "border-red-500" : "border-gray-300"
                } rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                onChange={handleFileChange}
                onBlur={formik.handleBlur}
                accept=".jpg,.jpeg,.png,.gif"
              />
              {formik.touched.image && formik.errors.image ? (
                <div className="text-red-600 text-sm mt-1">{formik.errors.image}</div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
