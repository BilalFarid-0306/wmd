import { body, validationResult } from 'express-validator';

// Middleware to check validation results and return formatted response
export const checkValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array();
    return res.status(400).json({
      success: false,
      message: errorList[0].msg,
      errors: errorList.map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

// Login validation rules
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Student validation rules
export const validateStudent = [
  body('rollNo')
    .trim()
    .notEmpty()
    .withMessage('Roll number is required')
    .isLength({ min: 3, max: 20 })
    .withMessage('Roll number must be between 3 and 20 characters'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be exactly 10 digits'),
  body('gender')
    .trim()
    .notEmpty()
    .withMessage('Gender is required')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),
  body('dateOfBirth')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Date of birth must be a valid date'),
  body('department')
    .trim()
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'])
    .withMessage('Department must be CSE, IT, ECE, EEE, MECH, CIVIL, or Other'),
  body('year')
    .notEmpty()
    .withMessage('Year is required')
    .isInt({ min: 1, max: 4 })
    .withMessage('Year must be an integer between 1 and 4'),
  body('cgpa')
    .notEmpty()
    .withMessage('CGPA is required')
    .isFloat({ min: 0, max: 10 })
    .withMessage('CGPA must be a number between 0.0 and 10.0'),
  body('address')
    .optional()
    .trim(),
  body('status')
    .optional()
    .isIn(['Active', 'Inactive', 'Graduated'])
    .withMessage('Status must be Active, Inactive, or Graduated'),
];
