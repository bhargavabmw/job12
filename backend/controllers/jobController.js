const { body, validationResult } = require("express-validator"),
  jobs = require("../models/jobModel"),
  companies = require("../models/companyModel");
const valid = [
  body("title").trim().isLength({ min: 1, max: 150 }),
  body("description").trim().isLength({ min: 1, max: 65535 }),
  body("requirements").optional({ values: "falsy" }).isLength({ max: 65535 }),
  body("location").trim().isLength({ min: 1, max: 150 }),
  body("salary").optional({ values: "falsy" }).isLength({ max: 100 }),
  body("job_type").isIn([
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ]),
];
exports.validate = valid;
exports.list = async (req, res, next) => {
  try {
    res.json(await jobs.search(req.query));
  } catch (e) {
    next(e);
  }
};
exports.get = async (req, res, next) => {
  try {
    const j = await jobs.byId(req.params.id);
    j ? res.json(j) : res.status(404).json({ message: "Job not found" });
  } catch (e) {
    next(e);
  }
};
exports.create = async (req, res, next) => {
  try {
    let x = validationResult(req);
    if (!x.isEmpty())
      return res
        .status(422)
        .json({ message: "Validation failed", errors: x.array() });
    const c = await companies.mine(req.user.id);
    if (!c)
      return res
        .status(400)
        .json({ message: "Create a company profile first" });
    res
      .status(201)
      .json({ id: await jobs.create(c.id, req.body), message: "Job posted" });
  } catch (e) {
    next(e);
  }
};
exports.update = async (req, res, next) => {
  try {
    let x = validationResult(req);
    if (!x.isEmpty())
      return res
        .status(422)
        .json({ message: "Validation failed", errors: x.array() });
    if (!(await jobs.owned(req.params.id, req.user.id)))
      return res.status(404).json({ message: "Job not found" });
    await jobs.update(req.params.id, req.body);
    res.json({ message: "Job updated" });
  } catch (e) {
    next(e);
  }
};
exports.remove = async (req, res, next) => {
  try {
    if (!(await jobs.owned(req.params.id, req.user.id)))
      return res.status(404).json({ message: "Job not found" });
    await jobs.remove(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (e) {
    next(e);
  }
};
exports.mine = async (req, res, next) => {
  try {
    res.json(await jobs.mine(req.user.id));
  } catch (e) {
    next(e);
  }
};
