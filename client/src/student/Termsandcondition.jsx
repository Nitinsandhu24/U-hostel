import { useNavigate } from "react-router-dom";
import Navbar from "../pages/Navbar";

const TermsAndConditionsPage = () => {
  const navigate = useNavigate();

  const terms = [
    "All students must follow the hostel's code of conduct.",
    "Rooms are allotted on a first-come, first-serve basis.",
    "Fees once paid are non-refundable.",
    "Visitors are not allowed in the hostel rooms.",
    "Damage to property must be compensated by the student.",
    "Noise must be kept to a minimum after 10 PM.",
    "Cooking inside rooms is strictly prohibited.",
    "Maintain cleanliness in and around your room.",
    "Consumption of alcohol or drugs is strictly banned.",
    "Management reserves the right to cancel bookings anytime.",
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-6">
        <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Terms & Conditions
          </h2>

          <ul className="list-decimal list-inside text-gray-700 space-y-2 mb-6">
            {terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
