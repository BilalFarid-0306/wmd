import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Student from '../models/Student.js';

// Setup environment variables if run directly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const sampleStudents = [
  {
    rollNo: 'CS2021001',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'aarav.sharma@example.com',
    phone: '9876543210',
    gender: 'Male',
    dateOfBirth: new Date('2002-05-14'),
    department: 'CSE',
    year: 4,
    cgpa: 9.4,
    address: 'Flat 402, Green Valley Apts, Bangalore, Karnataka',
    status: 'Active',
  },
  {
    rollNo: 'CS2021002',
    firstName: 'Priya',
    lastName: 'Patel',
    email: 'priya.patel@example.com',
    phone: '9876543211',
    gender: 'Female',
    dateOfBirth: new Date('2003-08-22'),
    department: 'CSE',
    year: 3,
    cgpa: 8.9,
    address: '12 Sector 14, Gandhinagar, Gujarat',
    status: 'Active',
  },
  {
    rollNo: 'IT2022003',
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@example.com',
    phone: '9876543212',
    gender: 'Male',
    dateOfBirth: new Date('2003-11-10'),
    department: 'IT',
    year: 3,
    cgpa: 8.2,
    address: 'B-24 Malviya Nagar, New Delhi',
    status: 'Active',
  },
  {
    rollNo: 'EC2022004',
    firstName: 'Ananya',
    lastName: 'Iyer',
    email: 'ananya.iyer@example.com',
    phone: '9876543213',
    gender: 'Female',
    dateOfBirth: new Date('2003-01-30'),
    department: 'ECE',
    year: 3,
    cgpa: 9.1,
    address: '77 Anna Salai, Chennai, Tamil Nadu',
    status: 'Active',
  },
  {
    rollNo: 'ME2023005',
    firstName: 'Rohan',
    lastName: 'Nair',
    email: 'rohan.nair@example.com',
    phone: '9876543214',
    gender: 'Male',
    dateOfBirth: new Date('2004-03-19'),
    department: 'MECH',
    year: 2,
    cgpa: 7.8,
    address: 'Rose Villa, MG Road, Kochi, Kerala',
    status: 'Active',
  },
  {
    rollNo: 'EE2023006',
    firstName: 'Sneha',
    lastName: 'Gupta',
    email: 'sneha.gupta@example.com',
    phone: '9876543215',
    gender: 'Female',
    dateOfBirth: new Date('2004-09-05'),
    department: 'EEE',
    year: 2,
    cgpa: 8.6,
    address: '45 Park Street, Kolkata, West Bengal',
    status: 'Active',
  },
  {
    rollNo: 'CV2024007',
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@example.com',
    phone: '9876543216',
    gender: 'Male',
    dateOfBirth: new Date('2005-04-12'),
    department: 'CIVIL',
    year: 1,
    cgpa: 7.5,
    address: 'Shanti Path, Jaipur, Rajasthan',
    status: 'Active',
  },
  {
    rollNo: 'CS2024008',
    firstName: 'Divya',
    lastName: 'Reddy',
    email: 'divya.reddy@example.com',
    phone: '9876543217',
    gender: 'Female',
    dateOfBirth: new Date('2005-07-28'),
    department: 'CSE',
    year: 1,
    cgpa: 9.6,
    address: 'Hitech City Road, Hyderabad, Telangana',
    status: 'Active',
  },
  {
    rollNo: 'IT2021009',
    firstName: 'Mohammed',
    lastName: 'Bilal',
    email: 'mohammed.bilal@example.com',
    phone: '9876543218',
    gender: 'Male',
    dateOfBirth: new Date('2002-12-15'),
    department: 'IT',
    year: 4,
    cgpa: 9.2,
    address: 'Marine Drive, Mumbai, Maharashtra',
    status: 'Graduated',
  },
  {
    rollNo: 'EC2023010',
    firstName: 'Sara',
    lastName: 'Khan',
    email: 'sara.khan@example.com',
    phone: '9876543219',
    gender: 'Female',
    dateOfBirth: new Date('2004-06-18'),
    department: 'ECE',
    year: 2,
    cgpa: 8.4,
    address: 'Civil Lines, Lucknow, Uttar Pradesh',
    status: 'Active',
  },
  {
    rollNo: 'ME2021011',
    firstName: 'Arjun',
    lastName: 'Das',
    email: 'arjun.das@example.com',
    phone: '9876543220',
    gender: 'Male',
    dateOfBirth: new Date('2002-02-11'),
    department: 'MECH',
    year: 4,
    cgpa: 8.0,
    address: 'G.S. Road, Guwahati, Assam',
    status: 'Graduated',
  },
  {
    rollNo: 'CS2022012',
    firstName: 'Neha',
    lastName: 'Joshi',
    email: 'neha.joshi@example.com',
    phone: '9876543221',
    gender: 'Female',
    dateOfBirth: new Date('2003-10-09'),
    department: 'CSE',
    year: 3,
    cgpa: 9.0,
    address: 'FC Road, Pune, Maharashtra',
    status: 'Active',
  },
  {
    rollNo: 'EE2021013',
    firstName: 'Aditya',
    lastName: 'Kumar',
    email: 'aditya.kumar@example.com',
    phone: '9876543222',
    gender: 'Male',
    dateOfBirth: new Date('2002-08-25'),
    department: 'EEE',
    year: 4,
    cgpa: 7.9,
    address: 'Boring Road, Patna, Bihar',
    status: 'Inactive',
  },
  {
    rollNo: 'IT2024014',
    firstName: 'Meera',
    lastName: 'Menon',
    email: 'meera.menon@example.com',
    phone: '9876543223',
    gender: 'Female',
    dateOfBirth: new Date('2005-01-14'),
    department: 'IT',
    year: 1,
    cgpa: 8.7,
    address: 'Kowdiar, Thiruvananthapuram, Kerala',
    status: 'Active',
  },
  {
    rollNo: 'EC2024015',
    firstName: 'Karthik',
    lastName: 'Swaminathan',
    email: 'karthik.swami@example.com',
    phone: '9876543224',
    gender: 'Male',
    dateOfBirth: new Date('2005-09-20'),
    department: 'ECE',
    year: 1,
    cgpa: 8.5,
    address: 'Race Course, Coimbatore, Tamil Nadu',
    status: 'Active',
  },
  {
    rollNo: 'CV2022016',
    firstName: 'Pooja',
    lastName: 'Bhatt',
    email: 'pooja.bhatt@example.com',
    phone: '9876543225',
    gender: 'Female',
    dateOfBirth: new Date('2003-04-03'),
    department: 'CIVIL',
    year: 3,
    cgpa: 8.1,
    address: 'Rajpur Road, Dehradun, Uttarakhand',
    status: 'Active',
  },
  {
    rollNo: 'ME2023017',
    firstName: 'Sanjay',
    lastName: 'Rao',
    email: 'sanjay.rao@example.com',
    phone: '9876543226',
    gender: 'Male',
    dateOfBirth: new Date('2004-12-01'),
    department: 'MECH',
    year: 2,
    cgpa: 7.2,
    address: 'Kadri Hills, Mangalore, Karnataka',
    status: 'Inactive',
  },
  {
    rollNo: 'IT2023018',
    firstName: 'Tanvi',
    lastName: 'Deshmukh',
    email: 'tanvi.deshmukh@example.com',
    phone: '9876543227',
    gender: 'Female',
    dateOfBirth: new Date('2004-05-27'),
    department: 'IT',
    year: 2,
    cgpa: 9.3,
    address: 'Samarth Nagar, Aurangabad, Maharashtra',
    status: 'Active',
  },
  {
    rollNo: 'EE2024019',
    firstName: 'Harsh',
    lastName: 'Vardhan',
    email: 'harsh.vardhan@example.com',
    phone: '9876543228',
    gender: 'Male',
    dateOfBirth: new Date('2005-11-08'),
    department: 'EEE',
    year: 1,
    cgpa: 8.3,
    address: 'Bistupur, Jamshedpur, Jharkhand',
    status: 'Active',
  },
  {
    rollNo: 'CV2021020',
    firstName: 'Riya',
    lastName: 'Sen',
    email: 'riya.sen@example.com',
    phone: '9876543229',
    gender: 'Female',
    dateOfBirth: new Date('2002-07-16'),
    department: 'CIVIL',
    year: 4,
    cgpa: 8.8,
    address: 'Salt Lake City, Sector 5, Kolkata',
    status: 'Graduated',
  },
];

// Helper to seed default admin
export const seedDefaultAdmin = async () => {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
    });
    console.log(`[Seed] Default Admin created: ${adminEmail} (password: ${adminPassword})`);
  } else {
    console.log(`[Seed] Default Admin already exists: ${adminEmail}`);
  }
};

// Full seed script (can run standalone)
export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_records_db';
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
      console.log('[Seed] Connected to MongoDB');
    }

    // Seed Admin
    await seedDefaultAdmin();

    // Check if students exist
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.insertMany(sampleStudents);
      console.log(`[Seed] Successfully seeded ${sampleStudents.length} realistic student records.`);
    } else {
      console.log(`[Seed] Database already has ${studentCount} students. Skipping student seed.`);
    }

    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      console.log('[Seed] Seeding completed. Disconnecting...');
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error(`[Seed Error] ${error.message}`);
    if (process.argv[1] === fileURLToPath(import.meta.url)) {
      process.exit(1);
    }
  }
};

// Run directly if invoked from command line
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
