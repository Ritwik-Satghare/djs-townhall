import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    sapid: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, sapid, phone, email, password } = data;

    try {
      const response = await axios.post("/auth/register", {
        username: name,
        sapid,
        phone,
        email,
        password,
      });

      if (response.status === 201) {
        toast.success("Verification email sent!\nPlease check your inbox.", {
          duration: 60000,
        });
        setData({
          name: "",
          sapid: "",
          phone: "",
          email: "",
          password: "",
        });
      }

    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-[#0d0d0d] text-gray-200">
      {/* Form box */}
      <div className="w-full max-w-sm p-6 bg-[#1b1b1b] border border-gray-700 rounded-lg shadow-md">
        <h2 className="mb-4 text-lg font-semibold text-center text-gray-100">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Name</label>
            <input
              type="text"
              placeholder="Enter name..."
              value={data.name}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">SAPId</label>
            <input
              type="number"
              placeholder="Enter SAPId..."
              value={data.sapid}
              onChange={(e) => {
                setData({ ...data, sapid: e.target.value });
              }}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Phone</label>
            <input
              type="tel"
              placeholder="Enter phone..."
              value={data.phone}
              onChange={(e) => {
                setData({ ...data, phone: e.target.value });
              }}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter email..."
              value={data.email}
              onChange={(e) => {
                setData({ ...data, email: e.target.value });
              }}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:ring-cyan-500"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter password..."
              value={data.password}
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
              className="px-3 py-2 text-sm text-gray-200 bg-[#2a2a2a] border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-3 py-2 mt-2 text-sm font-medium text-white transition-colors rounded-md bg-cyan-500 hover:bg-cyan-600"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;