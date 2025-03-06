import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../pages/Navbar";

const StudentDashboard = () => {
  const student_id = localStorage.getItem("id");
  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            🎓 Student Dashboard
          </h1>

          <ul className="space-y-4">
            <li>
              <Link
                to="/applygatepass"
                className="block text-lg font-semibold text-gray-700 bg-blue-100 hover:bg-blue-200 py-3 px-4 rounded-lg transition duration-300 flex items-center gap-3"
              >
                📜 Apply Gate Pass
              </Link>
            </li>
            <li>
              <Link
                to="/checkpoint"
                className="block text-lg font-semibold text-gray-700 bg-blue-100 hover:bg-blue-200 py-3 px-4 rounded-lg transition duration-300 flex items-center gap-3"
              >
                🚧 Checkout
              </Link>
            </li>
            <li>
              <Link
                to="/complain"
                className="block text-lg font-semibold text-gray-700 bg-blue-100 hover:bg-blue-200 py-3 px-4 rounded-lg transition duration-300 flex items-center gap-3"
              >
                📝 Complain
              </Link>
            </li>
            <li>
              <Link
                to={`/getallfines/${student_id}`}
                className="block text-lg font-semibold text-gray-700 bg-blue-100 hover:bg-blue-200 py-3 px-4 rounded-lg transition duration-300 flex items-center gap-3"
              >
                💰 Fine
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
