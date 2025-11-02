// FormCreatorRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // Check if they came from event-creator
  if (!location.state?.fromEventCreator) {
    return <Navigate to="/event-creator" replace />;
  }

  return children;
};

export default ProtectedRoute;