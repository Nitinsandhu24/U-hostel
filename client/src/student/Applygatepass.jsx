import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ApplyGatePass() {
  const navigate = useNavigate();
  const [type, setType] = useState("day_out");
  const [date, setDate] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [reason, setReason] = useState("");
  const [gatePasses, setGatePasses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const applyGatePass = async () => {
    if (!type || !date || !outTime || !inTime || !reason) {
      alert("Please provide all required details");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gatepass/gate_pass_apply",
        { type, date, in_time: inTime, out_time: outTime, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      fetchGatePasses();
    } catch (error) {
      alert(error.response?.data?.message || "Error applying for gate pass");
    }
  };

  const fetchGatePasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/gatepass/getallgatepass",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGatePasses(response.data.gatepasses || []);
    } catch (error) {
      alert(error.response?.data?.message || "Error fetching gate passes");
    }
  };

  useEffect(() => {
    if (token) fetchGatePasses();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          📜 Apply for Gate Pass
        </h2>

        <div className="space-y-4">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="day_out">Day Out</option>
            <option value="night_out">Night Out</option>
          </select>

          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={outTime}
            onChange={(e) => setOutTime(e.target.value)}
          />

          <input
            type="time"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={inTime}
            onChange={(e) => setInTime(e.target.value)}
          />

          <textarea
            placeholder="Reason"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
            onClick={applyGatePass}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Display Gate Passes */}
      <div className="mt-6 bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
          📋 Your Gate Passes
        </h2>

        {gatePasses.length === 0 ? (
          <p className="text-gray-600 text-center">
            No gate passes applied yet.
          </p>
        ) : (
          <ul className="divide-y divide-gray-300">
            {gatePasses.map((pass, index) => (
              <li key={index} className="p-4 flex justify-between items-center">
                <span className="font-semibold">{index + 1}</span>
                <span className="font-semibold">{pass.type}</span>
                <span className="text-gray-600">{pass.out_time}</span>
                <span
                  className={`px-2 py-1 rounded-lg text-sm ${
                    pass.status === "pending"
                      ? "bg-yellow-500 text-white"
                      : pass.status === "rejected"
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {pass.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ApplyGatePass;
