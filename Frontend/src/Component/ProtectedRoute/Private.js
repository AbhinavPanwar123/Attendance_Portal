import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Private = ({ Component }) => {
  const rollno = useSelector((state) => state?.login?.students?.[0]?.rollno);
  if (rollno) {
    return <Component />;
  }

  return <Navigate to="/" />;
};

export default Private;
