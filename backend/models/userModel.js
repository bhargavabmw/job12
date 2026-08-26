const db = require("../config/db");
exports.byEmail = async (email) =>
  (await db.query("SELECT * FROM users WHERE email=?", [email]))[0][0];
exports.create = async ({ name, email, password, role }) =>
  (
    await db.query(
      "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
      [name, email, password, role],
    )
  )[0].insertId;
