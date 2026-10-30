import Student from '../models/Student.js';

// @desc    Get all students with search, filters, pagination, and sorting
// @route   GET /api/students
// @access  Private (Admin)
export const getStudents = async (req, res, next) => {
  try {
    const {
      search,
      department,
      year,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    const query = {};

    // Search filter across rollNo, firstName, lastName, email
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { rollNo: searchRegex },
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
      ];
    }

    // Exact filter matches
    if (department) {
      query.department = department;
    }
    if (year) {
      query.year = Number(year);
    }
    if (status) {
      query.status = status;
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortField = sortBy || 'createdAt';
    const sortOptions = { [sortField]: sortOrder };

    const [students, total] = await Promise.all([
      Student.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Student.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.json({
      success: true,
      students,
      total,
      page: pageNum,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private (Admin)
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    res.json({
      success: true,
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student record
// @route   POST /api/students
// @access  Private (Admin)
export const createStudent = async (req, res, next) => {
  try {
    const {
      rollNo,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      department,
      year,
      cgpa,
      address,
      status,
    } = req.body;

    // Check duplicate rollNo
    const existingRollNo = await Student.findOne({ rollNo: rollNo.trim().toUpperCase() });
    if (existingRollNo) {
      return res.status(409).json({
        success: false,
        message: `Student with roll number '${rollNo}' already exists.`,
      });
    }

    // Check duplicate email
    const existingEmail = await Student.findOne({ email: email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: `Student with email '${email}' already exists.`,
      });
    }

    const student = await Student.create({
      rollNo: rollNo.trim().toUpperCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      dateOfBirth: dateOfBirth || null,
      department,
      year: Number(year),
      cgpa: Number(cgpa),
      address: address ? address.trim() : '',
      status: status || 'Active',
    });

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      student,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student record
// @route   PUT /api/students/:id
// @access  Private (Admin)
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    const {
      rollNo,
      firstName,
      lastName,
      email,
      phone,
      gender,
      dateOfBirth,
      department,
      year,
      cgpa,
      address,
      status,
    } = req.body;

    // Check if rollNo is changed and if new one already exists
    if (rollNo && rollNo.trim().toUpperCase() !== student.rollNo) {
      const duplicateRoll = await Student.findOne({
        rollNo: rollNo.trim().toUpperCase(),
        _id: { $ne: student._id },
      });
      if (duplicateRoll) {
        return res.status(409).json({
          success: false,
          message: `Student with roll number '${rollNo}' already exists.`,
        });
      }
      student.rollNo = rollNo.trim().toUpperCase();
    }

    // Check if email is changed and if new one already exists
    if (email && email.trim().toLowerCase() !== student.email) {
      const duplicateEmail = await Student.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: student._id },
      });
      if (duplicateEmail) {
        return res.status(409).json({
          success: false,
          message: `Student with email '${email}' already exists.`,
        });
      }
      student.email = email.trim().toLowerCase();
    }

    // Update fields
    if (firstName) student.firstName = firstName.trim();
    if (lastName) student.lastName = lastName.trim();
    if (phone) student.phone = phone.trim();
    if (gender) student.gender = gender;
    student.dateOfBirth = dateOfBirth || null;
    if (department) student.department = department;
    if (year !== undefined) student.year = Number(year);
    if (cgpa !== undefined) student.cgpa = Number(cgpa);
    if (address !== undefined) student.address = address.trim();
    if (status) student.status = status;

    const updatedStudent = await student.save();

    res.json({
      success: true,
      message: 'Student record updated successfully',
      student: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private (Admin)
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student record not found',
      });
    }

    await student.deleteOne();

    res.json({
      success: true,
      message: 'Student record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics summary
// @route   GET /api/students/stats/summary
// @access  Private (Admin)
export const getStudentStats = async (req, res, next) => {
  try {
    const [totalStudents, activeStudents, cgpaAgg, countByDepartment] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'Active' }),
      Student.aggregate([
        {
          $group: {
            _id: null,
            avgCgpa: { $avg: '$cgpa' },
          },
        },
      ]),
      Student.aggregate([
        {
          $group: {
            _id: '$department',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            department: '$_id',
            count: 1,
          },
        },
        {
          $sort: { department: 1 },
        },
      ]),
    ]);

    const avgCgpa = cgpaAgg.length > 0 && cgpaAgg[0].avgCgpa
      ? Number(cgpaAgg[0].avgCgpa.toFixed(2))
      : 0;

    res.json({
      success: true,
      totalStudents,
      activeStudents,
      avgCgpa,
      countByDepartment,
    });
  } catch (error) {
    next(error);
  }
};
