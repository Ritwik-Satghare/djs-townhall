import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link, NavLink } from "react-router-dom";
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
      // If backend sends { message: "Account not verified" }
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
    <div>
      <div className="flex justify-center gap-4 mb-6">
        <NavLink to="/login/student">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={`${isActive ? "bg-blue-600 text-white" : ""}`}
            >
              Student
            </Button>
          )}
        </NavLink>

        <NavLink to="/login/club">
          {({ isActive }) => (
            <Button
              variant={isActive ? "default" : "outline"}
              className={`${isActive ? "bg-blue-600 text-white" : ""}`}
            >
              Club
            </Button>
          )}
        </NavLink>
      </div>

      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <label>Email: </label>
        <input
          type="email"
          placeholder="enter email..."
          value={data.email}
          onChange={(e) => {
            setData({ ...data, email: e.target.value });
          }}
        />
        <label>Password: </label>
        <input
          type="password"
          placeholder="enter password..."
          value={data.password}
          onChange={(e) => {
            setData({ ...data, password: e.target.value });
          }}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
