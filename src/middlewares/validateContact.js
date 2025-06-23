const { body, validationResult } = require('express-validator');

const validateContact = [
  body('user_id').isMongoId().withMessage('user_id debe ser un ObjectId válido'),
  body('phone').optional().isString().withMessage('phone debe ser un string'),
  body('email').optional().isEmail().withMessage('email debe ser un email válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateContact;
