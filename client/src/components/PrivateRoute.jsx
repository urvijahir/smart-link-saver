import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // No token → go to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // Token → allow access
  return children;
};

export default PrivateRoute;
