import React, { useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Login = ({ userType }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = data;

    try {
      const response = await axios.post(`/auth/login/${userType}`, {
        email,
        password,
      });

      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#0d0d0d] text-gray-200">
      {/* Toggle buttons */}
      <div className="flex justify-center gap-4 mb-6">
        <NavLink to="/login/student">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={`${
                isActive
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "border border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Student
            </Button>
          )}
        </NavLink>

        <NavLink to="/login/club">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={`${
                isActive
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "border border-gray-600 text-gray-300 hover:bg-gray-800"
              }`}
            >
              Club
            </Button>
          )}
        </NavLink>
      </div>

      {/* Form box */}
      <div className="w-full max-w-sm p-6 bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-center text-gray-100">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 mt-2 text-sm font-medium text-white transition-colors rounded-md bg-cyan-500 hover:bg-cyan-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
