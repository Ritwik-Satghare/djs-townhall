import "./App.css";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import LoginStudent from "./pages/LoginStudent.jsx";
import LoginClub from "./pages/LoginClub.jsx";
import VerifyPage from "./pages/VerifyPage.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import ClubDashboard from "./pages/ClubDashboard";
import EventsCreator from "./pages/EventsCreator";
import FormCreator from "./pages/FormCreator";
import {useFormStore} from "@/stores/FormStore"

// Axios default configuration
axios.defaults.baseURL = "http://localhost:8000/api/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <div>
      <Toaster position="bottom-center" reverseOrder={false} />

      {/* Navbar */}
      <Navbar />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect /login to /login/student */}
        <Route path="/login" element={<Navigate to="/login/student" replace />} />

        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/login/club" element={<LoginClub />} />
        <Route path="/verify-email" element={<VerifyPage />} />
        <Route path="/club-dashboard" element={<ClubDashboard />} />
        <Route path="/event-creator" element={<EventsCreator />} />
        <Route path="/form-creator" element={<FormCreator />} />
      </Routes>
    </div>
  );
}

export default App;
