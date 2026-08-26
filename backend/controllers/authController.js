const bcrypt = require("bcryptjs"),
  { body } = require("express-validator"),
  users = require("../models/userModel"),
  { createToken } = require("../utils/jwt"),
  { sendValidationError } = require("../utils/validation");
exports.registerValidate = [
  body("name").trim().isLength({ min: 2, max: 100 }),
  body("email").isEmail().isLength({ max: 150 }).normalizeEmail(),
  body("password").isLength({ min: 6, max: 72 }),
  body("role").isIn(["candidate", "recruiter"]),
];
exports.loginValidate = [body("email").isEmail().isLength({ max: 150 }).normalizeEmail(), body("password").notEmpty()];
exports.register = async (req, res, next) => {
  try {
    if (sendValidationError(req, res)) return;
    let { name, email, password, role } = req.body;
    if (await users.byEmail(email))
      return res.status(409).json({ message: "Email is already registered" });
    const id = await users.create({
      name,
      email,
      password: await bcrypt.hash(password, 12),
      role,
    });
    const user = { id, name, email, role };
    res
      .status(201)
      .json({ message: "Account created", token: createToken(user), user });
  } catch (e) {
    next(e);
  }
};
exports.login = async (req, res, next) => {
  try {
    if (sendValidationError(req, res)) return;
    const u = await users.byEmail(req.body.email);
    if (!u || !(await bcrypt.compare(req.body.password, u.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    const user = { id: u.id, name: u.name, email: u.email, role: u.role };
    res.json({ token: createToken(user), user });
  } catch (e) {
    next(e);
  }
};
