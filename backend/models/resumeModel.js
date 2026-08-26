const db = require("../config/db");
exports.list = async (user) =>
  (
    await db.query(
      "SELECT id,file_name,uploaded_date FROM resumes WHERE user_id=? ORDER BY uploaded_date DESC",
      [user],
    )
  )[0];
exports.byId = async (id, user) =>
  (
    await db.query("SELECT * FROM resumes WHERE id=? AND user_id=?", [id, user])
  )[0][0];
exports.create = async (user, file) =>
  (
    await db.query(
      "INSERT INTO resumes(user_id,file_name,file_path) VALUES(?,?,?)",
      [user, file.originalname, file.filename],
    )
  )[0].insertId;
exports.remove = (id) => db.query("DELETE FROM resumes WHERE id=?", [id]);
exports.forRecruiter = async (id, recruiter) =>
  (
    await db.query(
      "SELECT r.* FROM resumes r JOIN applications a ON a.resume_id=r.id JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id WHERE r.id=? AND c.recruiter_id=?",
      [id, recruiter],
    )
  )[0][0];
