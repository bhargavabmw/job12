const fs = require("fs"),
  path = require("path"),
  resumes = require("../models/resumeModel");
exports.list = async (req, res, next) => {
  try {
    res.json(await resumes.list(req.user.id));
  } catch (e) {
    next(e);
  }
};
exports.upload = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Choose a resume file" });
    let id;
    try {
      id = await resumes.create(req.user.id, req.file);
    } catch (error) {
      fs.unlink(req.file.path, () => {});
      throw error;
    }
    res
      .status(201)
      .json({
        id,
        file_name: req.file.originalname,
        message: "Resume uploaded",
      });
  } catch (e) {
    next(e);
  }
};
exports.remove = async (req, res, next) => {
  try {
    const r = await resumes.byId(req.params.id, req.user.id);
    if (!r) return res.status(404).json({ message: "Resume not found" });
    await resumes.remove(r.id);
    fs.unlink(
      path.join(__dirname, "..", "uploads", "resumes", r.file_path),
      () => {},
    );
    res.json({ message: "Resume removed" });
  } catch (e) {
    if (e.code === "ER_ROW_IS_REFERENCED_2")
      return res.status(409).json({ message: "This resume is linked to an application and cannot be deleted. Upload a new resume instead." });
    next(e);
  }
};
exports.downloadMine = async (req, res, next) => {
  try {
    const r = await resumes.byId(req.params.id, req.user.id);
    if (!r) return res.status(404).json({ message: "Resume not found" });
    res.download(path.join(__dirname, "..", "uploads", "resumes", r.file_path), r.file_name);
  } catch (e) { next(e); }
};
exports.download = async (req, res, next) => {
  try {
    const r = await resumes.forRecruiter(req.params.id, req.user.id);
    if (!r) return res.status(404).json({ message: "Resume not found" });
    res.download(
      path.join(__dirname, "..", "uploads", "resumes", r.file_path),
      r.file_name,
    );
  } catch (e) {
    next(e);
  }
};
