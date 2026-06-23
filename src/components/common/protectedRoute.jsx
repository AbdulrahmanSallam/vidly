import { Navigate, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ProtectedRoute = ({ user, adminOnly = false }) => {
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/movies" replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <Outlet />
    </motion.div>
  );
};

export default ProtectedRoute;
