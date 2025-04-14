import pool from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const otpStore = new Map();
export async function registerUser(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Fill all the fields" });
  }
  const newrole = role === "admin" ? "admin" : "student";

  if (password.length < 6) {
    return res.status(400).json({ message: "Minumum 6 character needed" });
  }

  try {
    const emailcheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (emailcheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role,created_at",
      [name, email, hashedpassword, newrole]
    );
    res
      .status(201)
      .json({ message: "Created Successfully", user: newUser.rows[0] });
  } catch (err) {
    console.log(err);

    return res.status(400).json({ err });
  }
}

export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Fill out all the fields" });
  }

  try {
    const useQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = useQuery.rows[0];

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); // Valid for 5 min

    await sendOtpEmail(user.email, otp);

    res.status(200).json({
      message: "OTP sent to your email",
      otpRequired: "OTP sent to your mail",
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error " + err });
  }
}

async function sendOtpEmail(email, otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MYEMAIL, // Your Gmail email address
      pass: process.env.PASS, // Your Gmail app password
    },
  });

  let mailOptions = {
    from: process.env.MYEMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
}

export async function verifyOtp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtp = otpStore.get(email);

  if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expiresAt) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // OTP is valid, remove from store
  otpStore.delete(email);

  // Fetch user details to issue JWT
  const useQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  const user = useQuery.rows[0];

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    message: "OTP verified successfully",
    token,
    role: user.role,
    id: user.id,
  });
}

export async function getUserProfile(req, res) {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}
