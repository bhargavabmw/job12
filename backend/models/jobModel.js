const db = require("../config/db");
exports.search = async ({
  q = "",
  location = "",
  job_type = "",
  salary = "",
}) => {
  let sql =
      "SELECT j.*,c.company_name FROM jobs j JOIN companies c ON c.id=j.company_id WHERE 1=1",
    p = [];
  if (q) {
    sql +=
      " AND (j.title LIKE ? OR c.company_name LIKE ? OR j.description LIKE ? OR j.requirements LIKE ?)";
    p.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (location) {
    sql += " AND j.location LIKE ?";
    p.push(`%${location}%`);
  }
  if (job_type) {
    sql += " AND j.job_type=?";
    p.push(job_type);
  }
  if (salary) {
    sql += " AND j.salary LIKE ?";
    p.push(`%${salary}%`);
  }
  return (await db.query(sql + " ORDER BY j.posted_date DESC", p))[0];
};
exports.byId = async (id) =>
  (
    await db.query(
      "SELECT j.*,c.company_name,c.description company_description,c.location company_location FROM jobs j JOIN companies c ON c.id=j.company_id WHERE j.id=?",
      [id],
    )
  )[0][0];
exports.owned = async (id, user) =>
  (
    await db.query(
      "SELECT j.* FROM jobs j JOIN companies c ON c.id=j.company_id WHERE j.id=? AND c.recruiter_id=?",
      [id, user],
    )
  )[0][0];
exports.create = async (company, data) =>
  (
    await db.query(
      "INSERT INTO jobs(company_id,title,description,requirements,location,salary,job_type) VALUES(?,?,?,?,?,?,?)",
      [
        company,
        data.title,
        data.description,
        data.requirements || "",
        data.location,
        data.salary || "",
        data.job_type,
      ],
    )
  )[0].insertId;
exports.update = (id, d) =>
  db.query(
    "UPDATE jobs SET title=?,description=?,requirements=?,location=?,salary=?,job_type=? WHERE id=?",
    [
      d.title,
      d.description,
      d.requirements || "",
      d.location,
      d.salary || "",
      d.job_type,
      id,
    ],
  );
exports.remove = (id) => db.query("DELETE FROM jobs WHERE id=?", [id]);
exports.mine = async (user) =>
  (
    await db.query(
      "SELECT j.*,COUNT(a.id) application_count FROM jobs j JOIN companies c ON c.id=j.company_id LEFT JOIN applications a ON a.job_id=j.id WHERE c.recruiter_id=? GROUP BY j.id ORDER BY j.posted_date DESC",
      [user],
    )
  )[0];
