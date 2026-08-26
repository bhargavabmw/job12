const r = require("express").Router(),
  c = require("../controllers/resumeController"),
  { authenticate } = require("../middleware/authMiddleware"),
  { allowRoles } = require("../middleware/roleMiddleware"),
  { upload } = require("../middleware/uploadMiddleware");
r.get("/", authenticate, allowRoles("candidate"), c.list);
r.post(
  "/upload",
  authenticate,
  allowRoles("candidate"),
  upload.single("resume"),
  c.upload,
);
r.delete("/:id", authenticate, allowRoles("candidate"), c.remove);
r.get("/my/:id", authenticate, allowRoles("candidate"), c.downloadMine);
r.get("/:id", authenticate, allowRoles("recruiter"), c.download);
module.exports = r;
