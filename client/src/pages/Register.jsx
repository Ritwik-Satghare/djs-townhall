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
    <div>
      <form onSubmit={handleSubmit}>
        <label>Name: </label>
        <input
          type="text"
          placeholder="enter name..."
          value={data.name}
          onChange={(e) => {
            setData({ ...data, name: e.target.value });
          }}
        />
        <label>SAPId: </label>
        <input
          type="number"
          placeholder="enter SAPId..."
          value={data.sapid}
          onChange={(e) => {
            setData({ ...data, sapid: e.target.value });
          }}
        />
        <label>Phone: </label>
        <input
          type="tel"
          placeholder="enter phone..."
          value={data.phone}
          onChange={(e) => {
            setData({ ...data, phone: e.target.value });
          }}
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
