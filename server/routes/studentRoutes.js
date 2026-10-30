import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats,
} from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateStudent, checkValidationErrors } from '../middleware/validators.js';

const router = express.Router();

// Apply protect middleware to all student routes
router.use(protect);

// Dashboard summary stats
router.get('/stats/summary', getStudentStats);

// List and create students
router
  .route('/')
  .get(getStudents)
  .post(validateStudent, checkValidationErrors, createStudent);

// Get, update, delete student by ID
router
  .route('/:id')
  .get(getStudentById)
  .put(validateStudent, checkValidationErrors, updateStudent)
  .delete(deleteStudent);

export default router;
