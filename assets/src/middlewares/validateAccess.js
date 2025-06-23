const { body, validationResult } = require('express-validator');

const validateAccess = [
  body('user_id').isMongoId().withMessage('user_id debe ser un ObjectId válido'),
  body('level').isInt().withMessage('level debe ser un número entero'),
  body('group').isString().withMessage('group debe ser un string'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateAccess;
