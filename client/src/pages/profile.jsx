import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login"); // Redirect if not logged in
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        localStorage.removeItem("token"); // Remove token if invalid
        navigate("/login"); // Redirect to login
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading)
    return <p className="text-center mt-5 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-red-500">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="bg-white max-w-lg w-full p-8 rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 text-3xl font-bold">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* Profile Info */}
            <h2 className="text-2xl font-bold text-gray-800 mt-4">
              {profile?.name}
            </h2>
            <p className="text-gray-500">{profile?.role}</p>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-gray-700">
              <span className="font-semibold">📧 Email:</span> {profile?.email}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">🔑 Role:</span> {profile?.role}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
