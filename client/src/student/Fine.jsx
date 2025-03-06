import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../pages/Navbar";

const StudentFinePage = () => {
  const token = localStorage.getItem("token");
  const student_id = localStorage.getItem("id");

  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Student ID from localStorage:", student_id);
  console.log("Token from localStorage:", token);

  useEffect(() => {
    if (student_id && token) {
      fetchFines();
    } else {
      setError("Missing student ID or token. Please log in.");
      setLoading(false);
    }
  }, [student_id, token]);

  const fetchFines = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/fine/allfines/${student_id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFines(response.data.fine || []);
    } catch (err) {
      setError("Error fetching fines");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-6">
        <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            💰 Your Fines
          </h2>

          {loading ? (
            <p className="text-gray-700 text-center">Loading fines...</p>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : fines.length === 0 ? (
            <p className="text-gray-500 text-center">No fines imposed.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-100 text-gray-700">
                    <th className="py-3 px-4 text-left">Amount</th>
                    <th className="py-3 px-4 text-left">Reason</th>
                    <th className="py-3 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fines.map((fine) => (
                    <tr key={fine.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        ${fine.amt}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{fine.reason}</td>
                      <td
                        className={`py-3 px-4 font-bold ${
                          fine.status === "paid"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {fine.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFinePage;
