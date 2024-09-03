import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const RollNo = useSelector((state) => state?.login?.students?.[0]?.rollno);

  const handleClick = () => {
    navigate("/studentPage");
  };

  const fetchAttendanceData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/attendance", {
        params: { rollno: RollNo },
      });
      const rawAttendanceData = response.data.attendance || [];

      const formattedData = rawAttendanceData.map((record) => {
        const markinTime = new Date(record.markin);
        const markoutTime = record.markout
          ? new Date(record.markout)
          : new Date();
        const durationInMinutes = Math.max(
          (markoutTime - markinTime) / (1000 * 60),
          0
        );

        const hours = Math.floor(durationInMinutes / 60);
        const minutes = Math.floor(durationInMinutes % 60);

        return {
          date: markinTime.toLocaleDateString(),
          hoursAndMinutes: `${hours}h ${minutes}m`,
        };
      });

      setAttendanceData(formattedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setErrorMessage("Error fetching attendance data");
    }
  }, [RollNo]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            ATTENDANCE TABLE
          </h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded-lg">
              {errorMessage}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">
                    Date
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-sm uppercase tracking-wider">
                    Hours
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {attendanceData.length > 0 ? (
                  attendanceData.map((record, index) => (
                    <tr
                      key={index}
                      className="even:bg-gray-100 odd:bg-white hover:bg-gray-200"
                    >
                      <td className="py-3 px-6 border-b text-sm">
                        {record.date}
                      </td>
                      <td className="py-3 px-6 border-b text-sm">
                        {record.hoursAndMinutes}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="2"
                      className="py-3 px-6 text-center text-sm text-gray-500"
                    >
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleClick}
            className="bg-green-500 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-red-600"
          >
            Home
          </button>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">
          © 2024 Shine Dezign Infonet. All rights reserved.
        </p>
        <p className="text-sm">Powered by Varun Sodhi</p>
      </footer>
    </div>
  );
};

export default Attendance;
