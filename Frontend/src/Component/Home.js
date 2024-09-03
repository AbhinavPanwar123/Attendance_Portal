import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/LoginSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const Home = () => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [studentName, setStudentName] = useState("Student Name");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const RollNo = useSelector((state) => state?.login?.students?.[0]?.rollno);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/getStudent/${RollNo}`
        );
        
        if (response.data.success) {
          const { name, image } = response.data.profile;
          setStudentName(name || "Student Name");
          setProfileImage(image || "/default-profile.png"); 
        } else {
          console.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    if (RollNo) {
      fetchProfileData();
    }
  }, [RollNo]);

  const handleClick = () => {
    navigate("/attendance");
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMarkIn = async () => {
    setErrorMessage("");
    try {
      const response = await axios.post(`http://localhost:4000/api/markin`, {
        rollno: RollNo,
      });
      if (response.data.success) {
        toast.success("Marked In successfully!");
        console.log("Marked In:", response.data);
      } else {
        throw new Error(response.data.message || "Error marking in");
      }
    } catch (error) {
      console.error("Error marking in:", error);
      const message = error.response?.data?.message || error.message || "Error marking in";
      setErrorMessage(message);
      toast.error(message);
    }
  };
  
  const handleMarkOut = async () => {
    setErrorMessage("");
    try {
      const response = await axios.post(`http://localhost:4000/api/markout`, {
        rollno: RollNo,
      });
      if (response.data.success) {
        toast.success("Marked Out successfully!");
        console.log("Marked Out:", response.data);
      } else {
        throw new Error(response.data.message || "Error marking out");
      }
    } catch (error) {
      console.error("Error marking out:", error);
      const message = error.response?.data?.message || error.message || "Error marking out";
      setErrorMessage(message);
      toast.error(message);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6">
      <ToastContainer />
      <div className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        <div className="text-white font-bold text-2xl">Student Dashboard</div>
        <div className="relative">
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src={profileImage}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4 border-2 border-white"
            />
            <div className="text-white mr-4">
              <p className="font-semibold">{studentName}</p>
              <p className="text-sm text-gray-300">{RollNo}</p>
            </div>
            <div className="text-white">▼</div>
          </div>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-t-lg"
              >
                Logout
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-b-lg"
              >
                Profile
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-right mb-4">
        <h2 className="text-xl font-bold text-white">
          Current Time: {currentTime}
        </h2>
      </div>

      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome to Your Attendance Dashboard
        </h1>
        <p className="text-lg text-white">
          Here, you can mark your attendance and view your attendance history.
        </p>
      </div>

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-800 border border-red-400 rounded">
          {errorMessage}
        </div>
      )}

      <div className="text-center mb-4">
        <button
          onClick={handleMarkIn}
          className="bg-green-500 text-white py-2 px-6 rounded-lg mr-2 shadow-lg hover:bg-green-600"
        >
          Mark In
        </button>
        <button
          onClick={handleMarkOut}
          className="bg-red-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600"
        >
          Mark Out
        </button>
      </div>

      <div className="flex-grow flex items-center justify-center mb-4">
        <button
          onClick={handleClick}
          className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600"
        >
          Attendance
        </button>
      </div>

      <footer className="mt-auto text-center text-white py-4 bg-gray-800">
        <p className="text-sm">
          © 2024 Shine Dezign Infonet. All rights reserved.
        </p>
        <p className="text-sm">Powered by Varun Sodhi</p>
      </footer>
    </div>
  );
};

export default Home;
