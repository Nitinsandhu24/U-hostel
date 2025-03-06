import pool from "../database.js";


export async function getAllPendingGatePasses(req, res) {
  try {
    const result = await pool.query(
      "SELECT * FROM gate_pass WHERE status = 'pending'"
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ message: "No pending gate passes" });
    }

    return res.status(200).json({ gatepasses: result.rows });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function gate_pass_approval(req, res) {
  const { gate_pass_id, status } = req.body;
  if (!gate_pass_id || !status) {
    return res.status(400).json({ message: "Fill all the fields" });
  }
  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ message: "Invalid status selection" });
  }

  try {
    // Verify gate pass exists and is pending
    const checkQuery = await pool.query(
      "SELECT * FROM gate_pass WHERE id = $1 AND status = 'pending'",
      [gate_pass_id]
    );

    if (checkQuery.rows.length === 0) {
      return res.status(404).json({ message: "No pending gate pass found" });
    }
    

    // Update status
    await pool.query("UPDATE gate_pass SET status = $1 WHERE id = $2", [
      status,
      gate_pass_id,
    ]);

    return res
      .status(200)
      .json({ message: `Gate pass ${status} successfully` });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
