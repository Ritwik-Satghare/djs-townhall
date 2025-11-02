import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ClubAdminRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkClubAdmin = async () => {
      try {
        const response = await axios.get('/clubs/verify', {
          withCredentials: true
        });
        
        if (response.status === 200 && response.data.authenticated) {
          setIsAuthorized(true);
        }
      } catch (error) {
        setIsAuthorized(false);
        console.log(error);
        
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkClubAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0d0d0d]">
        <div className="text-gray-200">Verifying access...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to login if not authorized
    return <Navigate to="/login/club" replace />;
  }

  return children;
};

export default ClubAdminRoute;