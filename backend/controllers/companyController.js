const { body, validationResult } = require("express-validator"),
  companies = require("../models/companyModel");
exports.validate = [
  body("company_name").trim().isLength({ min: 1, max: 150 }),
  body("location").trim().isLength({ min: 1, max: 150 }),
  body("description").optional({ values: "falsy" }).isLength({ max: 65535 }),
];
exports.getMine = async (req, res, next) => {
  try {
    res.json((await companies.mine(req.user.id)) || null);
  } catch (e) {
    next(e);
  }
};
exports.save = async (req, res, next) => {
  try {
    let x = validationResult(req);
    if (!x.isEmpty())
      return res
        .status(422)
        .json({ message: "Validation failed", errors: x.array() });
    await companies.save(req.user.id, req.body);
    res.json(await companies.mine(req.user.id));
  } catch (e) {
    next(e);
  }
};
