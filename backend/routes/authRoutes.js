const r = require("express").Router(),
  c = require("../controllers/authController");
r.post("/register", c.registerValidate, c.register);
r.post("/login", c.loginValidate, c.login);
module.exports = r;
