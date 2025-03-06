import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center py-12 px-6">
        <h2 className="text-3xl font-bold text-white mb-8">
          🚀 Admin Dashboard
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gate Pass Approval */}
          <div
            className="bg-white/90 backdrop-blur-lg shadow-lg p-6 rounded-xl cursor-pointer hover:shadow-2xl transition transform hover:scale-105 border border-gray-200"
            onClick={() => navigate("/approvegatepass")}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              📜 New Applications for Gate Pass
            </h3>
            <p className="text-gray-600 mt-2">
              Review and approve/reject gate pass requests.
            </p>
          </div>

          {/* Impose Fine */}
          <div
            className="bg-white/90 backdrop-blur-lg shadow-lg p-6 rounded-xl cursor-pointer hover:shadow-2xl transition transform hover:scale-105 border border-gray-200"
            onClick={() => navigate("/imposefine")}
          >
            <h3 className="text-xl font-semibold text-gray-800">
              ⚖️ Impose Fine
            </h3>
            <p className="text-gray-600 mt-2">
              Issue and manage fines for students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
