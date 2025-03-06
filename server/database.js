import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "uhostel",
  password: "98123145",
  port: 5432,
});

export default pool;
