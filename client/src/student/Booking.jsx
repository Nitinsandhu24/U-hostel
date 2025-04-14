import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../pages/Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookingPage = () => {
  const token = localStorage.getItem("token");
  const student_id = localStorage.getItem("id");
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState(""); // State for selected room
  const [loading, setLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const roomOptions = [
    { id: 1, label: "1-Seater - ₹50,000", price: 50000 },
    { id: 2, label: "2-Seater - ₹40,000", price: 40000 },
    { id: 3, label: "3-Seater - ₹35,000", price: 35000 },
    { id: 4, label: "4-Seater - ₹30,000", price: 30000 },
  ];

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => toast.error("Failed to load Razorpay script.");
    document.body.appendChild(script);

    // Load stored room price from localStorage (if any)
    const storedRoomType = localStorage.getItem("roomType");
    if (storedRoomType) {
      setRoomType(storedRoomType);
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handletermandconditon = () => {
    navigate("/terms");
  };

  const handleBooking = async () => {
    if (!razorpayLoaded) {
      toast.error("Razorpay is not ready yet. Please wait.");
      return;
    }

    if (!roomType) {
      toast.error("Please select a room type.");
      return;
    }

    if (!termsAccepted) {
      toast.error("You must agree to the Terms and Conditions.");
      return;
    }

    const selectedRoom = roomOptions.find(
      (room) => room.id === parseInt(roomType)
    );
    if (!selectedRoom) {
      toast.error("Invalid room type.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings/create-order",
        {
          user_id: student_id,
          room_type_id: selectedRoom.id,
          amount: selectedRoom.price,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { orderId, amount, booking_id } = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Hostel Booking",
        description: "Room booking fee",
        order_id: orderId,
        handler: async function (response) {
          try {
            toast.success("Payment successful!");

            await axios.post(
              "http://localhost:5000/api/bookings/payment-success",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                booking_id,
                amount,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            window.location.href = "/successpage";
          } catch (err) {
            toast.error("Payment recording failed!");
            console.error("Error saving payment:", err);
          }
        },
        prefill: {
          name: "Student",
          email: "student@example.com",
        },
        theme: {
          color: "#22c55e",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Booking failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (e) => {
    const selectedRoomId = e.target.value;
    setRoomType(selectedRoomId);

    // Store the selected room type in localStorage
    localStorage.setItem("roomType", selectedRoomId);

    // Optionally, you can also store the corresponding price in localStorage:
    const selectedRoom = roomOptions.find(
      (room) => room.id === parseInt(selectedRoomId)
    );
    if (selectedRoom) {
      localStorage.setItem("roomPrice", selectedRoom.price);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-6">
        <div className="bg-white max-w-md w-full p-8 rounded-lg shadow-xl border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Book a Room
          </h2>

          <div className="mb-6">
            <label className="block mb-1 font-medium text-gray-700">
              Select Room Type
            </label>
            <select
              value={roomType}
              onChange={handleRoomSelect}
              className="w-full p-2 border rounded"
            >
              <option value="">Select...</option>
              {roomOptions.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.label}
                </option>
              ))}
            </select>
          </div>

          {roomType && (
            <>
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={() => setTermsAccepted(!termsAccepted)}
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the Hostel{" "}
                  <button onClick={handletermandconditon}>
                    Terms & Conditions.
                  </button>
                </label>
              </div>

              <button
                onClick={handleBooking}
                disabled={loading || !termsAccepted}
                className={`${
                  loading || !termsAccepted
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-bold py-2 px-4 rounded w-full`}
              >
                {loading ? "Processing..." : "Book & Pay"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
