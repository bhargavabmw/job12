const db = require("../config/db");
exports.exists = async (job, user) =>
  (
    await db.query("SELECT id FROM applications WHERE job_id=? AND user_id=?", [
      job,
      user,
    ])
  )[0][0];
exports.create = (job, user, resume) =>
  db.query("INSERT INTO applications(job_id,user_id,resume_id) VALUES(?,?,?)", [
    job,
    user,
    resume,
  ]);
exports.mine = async (user) =>
  (
    await db.query(
      "SELECT a.*,j.title,j.location,c.company_name FROM applications a JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id WHERE a.user_id=? ORDER BY a.applied_date DESC",
      [user],
    )
  )[0];
exports.byJob = async (job, recruiter) =>
  (
    await db.query(
      "SELECT a.*,u.name,u.email,r.file_name FROM applications a JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id JOIN users u ON u.id=a.user_id JOIN resumes r ON r.id=a.resume_id WHERE a.job_id=? AND c.recruiter_id=?",
      [job, recruiter],
    )
  )[0];
exports.forRecruiter = async (recruiter) =>
  (
    await db.query(
      "SELECT a.*,j.title,u.name,u.email,r.file_name FROM applications a JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id JOIN users u ON u.id=a.user_id JOIN resumes r ON r.id=a.resume_id WHERE c.recruiter_id=? ORDER BY a.applied_date DESC",
      [recruiter],
    )
  )[0];
exports.owned = async (id, recruiter) =>
  (
    await db.query(
      "SELECT a.id FROM applications a JOIN jobs j ON j.id=a.job_id JOIN companies c ON c.id=j.company_id WHERE a.id=? AND c.recruiter_id=?",
      [id, recruiter],
    )
  )[0][0];
exports.status = (id, status) =>
  db.query("UPDATE applications SET status=? WHERE id=?", [status, id]);
