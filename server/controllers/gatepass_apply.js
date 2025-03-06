import pool from "../database.js";

export async function gate_pass_apply(req, res) {
  const { type, date, in_time, out_time, reason } = req.body;
  const student_id = req.user.id;
  if (!type || !date || !out_time || !in_time || !reason) {
    return res
      .status(400)
      .json({ message: "Please provide all required details" });
  }

  if (type !== "day_out" && type !== "night_out") {
    return res
      .status(400)
      .json({ message: "Invalid type. Choose 'day_out' or 'night_out'" });
  }
  try {
    const result = await pool.query(
      "INSERT INTO gate_pass(student_id,type,date,out_time,in_time,reason,status) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *",
      [student_id, type, date, out_time, in_time, reason, "pending"]
    );
    return res
      .status(201)
      .json({ message: "Gate pass applied" + result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" + err });
  }
}

export async function getallgatepass(req, res) {
  const student_id = req.user.id;
  console.log(student_id);
  
  try {
    const gatepasses = await pool.query(
      "SELECT * FROM gate_pass WHERE student_id = $1",
      [student_id]
    );
    // console.log(gatepasses.rows);
    
    if(gatepasses.rows.length === 0){
      return res.status(200).json({message : "No gatepass till now"})
    }
    return res.status(200).json({ gatepasses: gatepasses.rows });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
}
