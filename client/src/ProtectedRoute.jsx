import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem("loggedIn");

  if (!userRole) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to={`/${userRole}-dashboard`} />;
  }

  return children;
};

export default ProtectedRoute;
