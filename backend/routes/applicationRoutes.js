const r = require("express").Router(),
  c = require("../controllers/applicationController"),
  { authenticate } = require("../middleware/authMiddleware"),
  { allowRoles } = require("../middleware/roleMiddleware");
r.post("/", authenticate, allowRoles("candidate"), c.applyValidate, c.apply);
r.get("/my", authenticate, allowRoles("candidate"), c.mine);
r.get("/job/:jobId", authenticate, allowRoles("recruiter"), c.byJob);
r.get("/recruiter", authenticate, allowRoles("recruiter"), c.all);
r.put(
  "/:id/status",
  authenticate,
  allowRoles("recruiter"),
  c.statusValidate,
  c.status,
);
module.exports = r;
