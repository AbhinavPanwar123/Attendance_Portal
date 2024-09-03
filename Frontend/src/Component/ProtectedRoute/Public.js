import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Public = ({ Component }) => {
  const rollno = useSelector((state) => state?.login?.students?.[0]?.rollno);
  if (rollno) {
    return <Navigate to="/studentPage" />;
  }

  return <Component />;
};

export default Public;
