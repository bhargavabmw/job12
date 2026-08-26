const multer = require("multer"),
  path = require("path"),
  fs = require("fs");
const folder = path.join(__dirname, "..", "uploads", "resumes");
fs.mkdirSync(folder, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: folder,
    filename: (_, f, cb) =>
      cb(
        null,
        `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(f.originalname).toLowerCase()}`,
      ),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    return allowedTypes.includes(file.mimetype) && allowedExtensions.includes(extension)
      ? cb(null, true)
      : cb(new Error("Only PDF, DOC, and DOCX resumes are accepted"));
  },
});
module.exports = { upload, folder };
