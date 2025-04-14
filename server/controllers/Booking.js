// controllers/bookingController.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import pool from "../database.js";
import razorpay from "../middleware/razorpay.js";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MYEMAIL,
    pass: process.env.PASS,
  },
});

const sendConfirmationMail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Hostel Admin" <${process.env.MYEMAIL}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

// 🎯 Controller: Create Razorpay Order
const createOrder = async (req, res) => {
  console.log("start");

  try {
    const { user_id, room_type_id } = req.body;

    // 1. Fetch room amount
    const roomQuery = await pool.query(
      "SELECT base_price_per_semester FROM room_types WHERE id = $1",
      [room_type_id]
    );

    if (roomQuery.rows.length === 0) {
      return res.status(404).json({ error: "Room type not found" });
    }

    const amount = roomQuery.rows[0].base_price_per_semester;

    // 2. Fetch user
    const userQuery = await pool.query(
      "SELECT email, name FROM users WHERE id = $1",
      [user_id]
    );

    if (userQuery.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userQuery.rows[0];

    // 3. Create booking
    const bookingQuery = await pool.query(
      `INSERT INTO bookings (user_id, room_type_id)
       VALUES ($1, $2) RETURNING id`,
      [user_id, room_type_id]
    );

    const bookingId = bookingQuery.rows[0].id;

    // 4. Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    // 5. Update booking with order ID
    await pool.query(
      "UPDATE bookings SET razorpay_order_id = $1 WHERE id = $2",
      [order.id, bookingId]
    );

    // 6. Send email
    const emailText = `
Hi ${user.name},

✅ Your hostel booking Razorpay order has been created.

📌 Booking ID: ${bookingId}
🧾 Order ID: ${order.id}
💰 Amount: ₹${amount}
🏠 Room Type ID: ${room_type_id}

Please complete the payment using Razorpay checkout.

Regards,  
Hostel Admin Team`;

    await sendConfirmationMail(
      user.email,
      "Hostel Booking - Payment Order Created",
      emailText
    );

    res.json({
      success: true,
      orderId: order.id,
      amount,
      bookingId,
    });
  } catch (err) {
    console.error("❌ Order creation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 🎯 Controller: Handle Razorpay Payment Success
const handlePaymentSuccess = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      booking_id,
      amount,
    } = req.body;

    // Save payment to payments table
    await pool.query(
      `INSERT INTO payments 
        (booking_id, razorpay_payment_id, razorpay_signature, status, amount)
       VALUES ($1, $2, $3, $4, $5)`,
      [booking_id, razorpay_payment_id, razorpay_signature, "success", amount]
    );

    // Update booking status
    await pool.query("UPDATE bookings SET status = $1 WHERE id = $2", [
      "confirmed",
      booking_id,
    ]);

    res.status(200).json({ message: "Payment recorded successfully" });
  } catch (error) {
    console.error("Error recording payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Export both functions
export { createOrder, handlePaymentSuccess };
