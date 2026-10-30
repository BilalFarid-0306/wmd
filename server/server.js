import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { seedDefaultAdmin, sampleStudents } from './utils/seedAdmin.js';
import Student from './models/Student.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
await connectDB();

// Automatically ensure default admin & sample data exist
try {
  await seedDefaultAdmin();
  const count = await Student.countDocuments();
  if (count === 0) {
    await Student.insertMany(sampleStudents);
    console.log(`[Seed] Automatically populated initial ${sampleStudents.length} sample students.`);
  }
} catch (err) {
  console.error('[Auto-Seed Warning]', err.message);
}

const app = express();

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman) or matching origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Student Record Management System API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Server] Backend running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
});
