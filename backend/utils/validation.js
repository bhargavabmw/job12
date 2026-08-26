const { validationResult } = require('express-validator');

function sendValidationError(req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) return false;
  res.status(422).json({ message: 'Validation failed', errors: result.array() });
  return true;
}

module.exports = { sendValidationError };
