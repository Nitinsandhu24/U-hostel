import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";

function Signup() {
  const { role } = useParams();
  const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Please enter all fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        { name, email, password, role }
      );

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ✍️ Signup as {capitalizedRole}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            onChange={(e) => setName(e.target.value)}
          />
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
            onClick={handleSignup}
          >
            Signup
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
