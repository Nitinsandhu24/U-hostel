import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyToken() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("email"); // Get email from local storage

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Please enter OTP");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/verify-otp",
        {
          email,
          otp,
        }
      );

      alert(response.data.message);

      // Save token & user info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("loggedIn", response.data.role);
      localStorage.setItem("id", response.data.id);

      // Redirect based on role
      if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-blue-600 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          📩 Verify OTP
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full p-3 border border-gray-300 rounded-md"
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md"
            onClick={handleVerifyOtp}
          >
            Verify OTP
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyToken;
