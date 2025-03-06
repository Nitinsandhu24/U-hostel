import pool from "../database.js";

export async function ImposeFine(req, res) {
  const { student_id, amt, reason } = req.body;
  if (!student_id || !amt || !reason) {
    return res.status(400).json({ message: "All fields are needed" });
  }
  try {
    const newFine = await pool.query(
      "INSERT INTO fines(student_id,amt,reason) VALUES($1,$2,$3) RETURNING *",
      [student_id, amt, reason]
    );
    if (newFine.rows.length === 0) {
      return res.status(200).json({ message: "Not a valid id" });
    }
    return res
      .status(200)
      .json({ message: "Fine imposed successfully", fine: newFine.rows[0] });
  } catch (err) {
    console.log(err);

    return res.status(500).json({ message: "Internal server error" + err });
  }
}

export async function getallfines(req, res) {
  const { student_id } = req.params;
  console.log(student_id);

  try {
    const allfines = await pool.query(
      "SELECT * FROM fines WHERE student_id = $1",
      [student_id]
    );

    return res
      .status(200)
      .json({ fine: allfines.rows.length > 0 ? allfines.rows : [],student_id});
  } catch (err) {
    // console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function Finepad(req, res) {
  const { fineid } = req.params;
  console.log(fineid);

  try {
    const updateFine = await pool.query(
      "UPDATE fines SET status = 'paid' WHERE id = $1 RETURNING *",
      [fineid]
    );

    if (updateFine.rows.length === 0) {
      return res.status(404).json({ message: "No fine found" });
    }

    return res.status(200).json({ fine: updateFine.rows[0] });
  } catch (err) {
    console.error("Database Error:", err); // Better error logging
    return res.status(500).json({ message: "Internal server error" });
  }
}
