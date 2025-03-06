import { useNavigate } from "react-router-dom";
import { FaUserShield, FaUserGraduate } from "react-icons/fa"; // Icons for UI enhancement

function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-sm w-full text-center border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          🎭 Select Your Role
        </h2>

        <button
          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-md mb-4 hover:bg-blue-700 transition duration-300 text-lg font-semibold"
          onClick={() => navigate("/signup/admin")}
        >
          <FaUserShield /> Signup as Admin
        </button>

        <button
          className="w-full flex items-center justify-center gap-3 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition duration-300 text-lg font-semibold"
          onClick={() => navigate("/signup/student")}
        >
          <FaUserGraduate /> Signup as Student
        </button>
      </div>
    </div>
  );
}

export default RoleSelection;
