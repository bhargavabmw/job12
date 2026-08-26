const r = require("express").Router(),
  c = require("../controllers/companyController"),
  { authenticate } = require("../middleware/authMiddleware"),
  { allowRoles } = require("../middleware/roleMiddleware");
r.get("/me", authenticate, allowRoles("recruiter"), c.getMine);
r.put("/me", authenticate, allowRoles("recruiter"), c.validate, c.save);
module.exports = r;
