import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners"; // spinner component

function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const [redirecting, setRedirecting] = useState(false); // spinner only during redirect
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/auth/verify/${token}`);
        if (response.status === 200) {
          setStatus("Email verified successfully! Redirecting to login...");
          setRedirecting(true); // show spinner during redirect
          setTimeout(() => {
            navigate(`/login/${response.data.type}`);
          }, 2500); // 2.5 seconds countdown
        } else {
          setStatus("Email verification failed. Please try again.");
        }
      } catch (error) {
        setStatus("Email verification failed. Please try again.");
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center mt-12">
      <h2 className="mb-5 text-xl font-semibold text-center">{status}</h2>
      {redirecting && <ClipLoader size={50} color="#123abc" />}
    </div>
  );
}

export default VerifyEmail;
