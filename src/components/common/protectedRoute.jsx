import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = ({ user }) => {
  const location = useLocation();

  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};

export default ProtectedRoute;
