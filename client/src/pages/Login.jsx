import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          email,
          password,
        }
      );

      alert(response.data.message);
      localStorage.setItem("loggedIn", response.data.role);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("id", response.data.id);

      if (response.data.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          🔑 Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            onClick={handleLogin}
          >
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <span
              className="text-blue-500 cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
