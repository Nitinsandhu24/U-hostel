import { useState, useEffect } from "react";
import axios from "axios";

const ApproveGatePass = () => {
  const [gatePasses, setGatePasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(""); // Success/Error messages
  const token = localStorage.getItem("token");

  // Fetch Pending Gate Passes
  const fetchGatePasses = async () => {
    setLoading(true);
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.get(
        "http://localhost:5000/api/gatepass/getallpending",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setGatePasses(response.data.gatepasses || []);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatePasses();
  }, []);

  // Approve or Reject Gate Pass
  const handleApproval = async (gate_pass_id, status) => {
    setMessage(""); // Clear previous messages
    try {
      const response = await axios.post(
        "http://localhost:5000/api/gatepass/gate_pass_approval",
        { gate_pass_id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message);
      fetchGatePasses(); // Refresh the list after approval/rejection
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating gate pass");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <div className="bg-white/90 backdrop-blur-lg shadow-lg rounded-xl p-6 max-w-lg w-full border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          🛂 Approve Gate Pass
        </h2>

        {/* Success/Error Messages */}
        {message && (
          <p
            className={`text-center p-2 rounded-md mb-4 ${
              message.includes("success")
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}
          >
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-gray-600 text-center animate-pulse">
            Loading gate passes...
          </p>
        ) : gatePasses.length === 0 ? (
          <p className="text-gray-600 text-center">No pending gate passes.</p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {gatePasses.map((pass) => (
              <li
                key={pass.id}
                className="p-4 flex justify-between items-center bg-white shadow-md rounded-lg my-3 border border-gray-200"
              >
                <div>
                  <p className="font-semibold text-gray-800">{pass.type}</p>
                  <p className="text-gray-600">
                    {pass.date} - {pass.out_time}
                  </p>
                  <p className="text-gray-500 text-sm">{pass.reason}</p>
                </div>
                <div className="space-y-2">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105"
                    onClick={() => handleApproval(pass.id, "approved")}
                  >
                    ✅ Approve
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md transition-transform transform hover:scale-105"
                    onClick={() => handleApproval(pass.id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ApproveGatePass;
