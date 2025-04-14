import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Importing an icon

const PaymentSuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-green-200 to-blue-300">
      <div className="bg-white shadow-xl rounded-lg p-12 text-center max-w-lg w-full">
        {/* Success Icon */}
        <FaCheckCircle className="text-green-500 text-6xl mb-6 animate-pulse" />

        <h1 className="text-4xl font-extrabold text-green-600 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Your booking has been successfully confirmed. We are excited to have
          you with us!
        </p>

        {/* Action Button */}
        <Link
          to="/student-dashboard"
          className="bg-green-500 text-white py-3 px-8 rounded-lg text-xl hover:bg-green-600 transition duration-300"
        >
          Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
