import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Header from './Header';

const ProtectedRoute = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {/* Only render the header if the user is logged in */}
      <Header />
      <Outlet /> {/* This renders the child route content */}
    </>
  );
};

export default ProtectedRoute;
