import pool from "../database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    return res.status(400).json({ message: "fill out all the fields" });
  }
  try {
    const useQuery = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = useQuery.rows[0];
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "check your password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ message: "Logged in successfully", token, role: user.role,id : user.id});
  } catch (err) {
    return res.status(500).json({ message: "Internal server error " + err });
  }
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
