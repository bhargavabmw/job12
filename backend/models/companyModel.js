const db = require("../config/db");
exports.mine = async (id) =>
  (await db.query("SELECT * FROM companies WHERE recruiter_id=?", [id]))[0][0];
exports.save = async (id, data) =>
  db.query(
    "INSERT INTO companies(recruiter_id,company_name,description,location) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE company_name=VALUES(company_name),description=VALUES(description),location=VALUES(location)",
    [id, data.company_name, data.description || "", data.location],
  );
