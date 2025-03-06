import { useState, useEffect } from "react";
import axios from "axios";

function FineManagement() {
  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [fines, setFines] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch fines
  const fetchFines = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/fine/allfines/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFines(response.data.fine || []);
    } catch (error) {
      alert("Error fetching fines");
    }
  };

  useEffect(() => {
    if (studentId) fetchFines();
  }, [studentId]);

  // Impose fine
  const imposeFine = async () => {
    if (!studentId || !amount || !reason) {
      alert("All fields are required");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/fine/imposefine",
        { student_id: studentId, amt: amount, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Fine imposed successfully");
      fetchFines();
    } catch (error) {
      alert("Error imposing fine");
    }
  };

  // Mark fine as paid
  const markAsPaid = async (fineid) => {
    try {
      await axios.put(
        `http://localhost:5000/api/fine/updatestatus/${fineid}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Fine marked as paid");
      fetchFines();
    } catch (error) {
      alert("Error updating fine");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white font-sans">
      {/* Impose Fine Section */}
      <div className="bg-white text-gray-900 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4">📌 Impose Fine</h2>
        <input
          type="number"
          placeholder="Student ID"
          className="w-full p-3 border border-gray-300 rounded-md mb-2"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-3 border border-gray-300 rounded-md mb-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <textarea
          placeholder="Reason"
          className="w-full p-3 border border-gray-300 rounded-md mb-2"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        ></textarea>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            onClick={imposeFine}
          >
            Impose Fine
          </button>
        </div>
      </div>

      {/* Fines List */}
      <div className="mt-6 bg-white text-gray-900 shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center mb-4">📋 Fines</h2>
        {fines.length === 0 ? (
          <p className="text-center text-gray-600">No fines imposed.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Reason</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {fines.map((fine, index) => (
                <tr key={index} className="text-center">
                  <td className="p-3 border">{fine.id}</td>
                  <td className="p-3 border">₹{fine.amt}</td>
                  <td className="p-3 border">{fine.reason}</td>
                  <td
                    className={`p-3 border ${
                      fine.status === "unpaid"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {fine.status}
                  </td>
                  <td className="p-3 border">
                    {fine.status === "unpaid" && (
                      <div className="flex justify-center space-x-4">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-700"
                          onClick={() => markAsPaid(fine.id)}
                        >
                          Mark as Paid
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default FineManagement;
