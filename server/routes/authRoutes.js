import express from 'express';
import { login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateLogin, checkValidationErrors } from '../middleware/validators.js';

const router = express.Router();

router.post('/login', validateLogin, checkValidationErrors, login);
router.get('/me', protect, getMe);

export default router;
