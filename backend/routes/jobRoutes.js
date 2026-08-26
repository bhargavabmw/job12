const r = require("express").Router(),
  c = require("../controllers/jobController"),
  { authenticate } = require("../middleware/authMiddleware"),
  { allowRoles } = require("../middleware/roleMiddleware");
r.get("/", c.list);
r.get("/mine", authenticate, allowRoles("recruiter"), c.mine);
r.get("/:id", c.get);
r.post("/", authenticate, allowRoles("recruiter"), c.validate, c.create);
r.put("/:id", authenticate, allowRoles("recruiter"), c.validate, c.update);
r.delete("/:id", authenticate, allowRoles("recruiter"), c.remove);
module.exports = r;
