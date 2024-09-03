import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const rollnoFormik = useFormik({
    initialValues: {
      rollno: "",
    },
    validationSchema: Yup.object({
      rollno: Yup.string()
        .required("Roll number is required")
        .matches(/^[0-9]+$/, "Roll number must be numeric"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:4000/api/verifyRollno", {
          rollno: values.rollno,
        });

        if (response.data.success) {
          setMessage("");
          setStep(2);
        } else {
          setMessage(`Verification failed: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response) {
          setMessage(`Server Error: ${error.response.data}`);
        } else if (error.request) {
          setMessage("Network Error");
        } else {
          setMessage(`Error: ${error.message}`);
        }
      }
    },
  });

  const passwordFormik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post("http://localhost:4000/api/resetPassword", {
          rollno: rollnoFormik.values.rollno,
          newPassword: values.newPassword,
        });

        if (response.data.success) {
          setMessage("Password reset successful");
          navigate("/");
        } else {
          setMessage(`Password reset failed: ${response.data.message}`);
        }
      } catch (error) {
        if (error.response) {
          setMessage(`Server Error: ${error.response.data}`);
        } else if (error.request) {
          setMessage("Network Error");
        } else {
          setMessage(`Error: ${error.message}`);
        }
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-black">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        {step === 1 && (
          <form onSubmit={rollnoFormik.handleSubmit}>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...rollnoFormik.getFieldProps("rollno")}
              />
              {rollnoFormik.touched.rollno && rollnoFormik.errors.rollno ? (
                <div className="text-red-600 text-sm mt-2">
                  {rollnoFormik.errors.rollno}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
            >
              Verify Roll Number
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={passwordFormik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="newPassword"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...passwordFormik.getFieldProps("newPassword")}
              />
              {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? (
                <div className="text-red-600 text-sm mt-2">
                  {passwordFormik.errors.newPassword}
                </div>
              ) : null}
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="confirmPassword"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                {...passwordFormik.getFieldProps("confirmPassword")}
              />
              {passwordFormik.touched.confirmPassword && passwordFormik.errors.confirmPassword ? (
                <div className="text-red-600 text-sm mt-2">
                  {passwordFormik.errors.confirmPassword}
                </div>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 shadow-lg"
            >
              Reset Password
            </button>
          </form>
        )}

        {message && (
          <div className="mt-4 text-center text-red-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
