import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, X, AlertCircle } from 'lucide-react';

const DEPARTMENTS = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const STATUSES = ['Active', 'Inactive', 'Graduated'];
const YEARS = [1, 2, 3, 4];

const StudentForm = ({ initialData = {}, onSubmit, loading, isEdit = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    rollNo: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    department: 'CSE',
    year: 1,
    cgpa: '',
    address: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      let formattedDob = '';
      if (initialData.dateOfBirth) {
        try {
          formattedDob = new Date(initialData.dateOfBirth).toISOString().split('T')[0];
        } catch {
          formattedDob = '';
        }
      }

      setFormData({
        rollNo: initialData.rollNo || '',
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        gender: initialData.gender || 'Male',
        dateOfBirth: formattedDob,
        department: initialData.department || 'CSE',
        year: initialData.year || 1,
        cgpa: initialData.cgpa !== undefined ? initialData.cgpa.toString() : '',
        address: initialData.address || '',
        status: initialData.status || 'Active',
      });
    }
  }, [initialData]);

  const validate = () => {
    const newErrors = {};

    if (!formData.rollNo.trim()) {
      newErrors.rollNo = 'Roll number is required';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (Number(formData.year) < 1 || Number(formData.year) > 4) {
      newErrors.year = 'Year must be between 1 and 4';
    }

    if (formData.cgpa === '' || formData.cgpa === null) {
      newErrors.cgpa = 'CGPA is required';
    } else {
      const numCgpa = parseFloat(formData.cgpa);
      if (isNaN(numCgpa) || numCgpa < 0 || numCgpa > 10) {
        newErrors.cgpa = 'CGPA must be a decimal between 0.0 and 10.0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      rollNo: formData.rollNo.trim().toUpperCase(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      year: Number(formData.year),
      cgpa: parseFloat(formData.cgpa),
      address: formData.address.trim(),
      dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : null,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Roll No */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Roll Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="rollNo"
            placeholder="e.g. CS2025001"
            value={formData.rollNo}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.rollNo
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.rollNo && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.rollNo}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Academic Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* First Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            First Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            placeholder="e.g. Aarav"
            value={formData.firstName}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.firstName
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.firstName && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.firstName}
            </p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Last Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            placeholder="e.g. Sharma"
            value={formData.lastName}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.lastName
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.lastName && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.lastName}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="e.g. aarav.sharma@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.email
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Phone Number (10 digits) <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            maxLength={10}
            placeholder="e.g. 9876543210"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.phone
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.phone && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Gender <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-4 pt-1.5">
            {GENDERS.map((gender) => (
              <label key={gender} className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={formData.gender === gender}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                />
                <span>{gender}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.gender}
            </p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Department <span className="text-rose-500">*</span>
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          {errors.department && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.department}
            </p>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Academic Year (1-4) <span className="text-rose-500">*</span>
          </label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
          >
            {YEARS.map((yr) => (
              <option key={yr} value={yr}>
                Year {yr}
              </option>
            ))}
          </select>
          {errors.year && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.year}
            </p>
          )}
        </div>

        {/* CGPA */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Cumulative GPA (0.0 - 10.0) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            name="cgpa"
            placeholder="e.g. 8.75"
            value={formData.cgpa}
            onChange={handleChange}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none ${
              errors.cgpa
                ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
            }`}
          />
          {errors.cgpa && (
            <p className="flex items-center gap-1 text-xs text-rose-500 mt-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.cgpa}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Residential Address
          </label>
          <textarea
            name="address"
            rows={3}
            placeholder="Enter student residential address..."
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate('/students')}
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors inline-flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400 rounded-xl shadow-sm transition-colors inline-flex items-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? 'Update Student Record' : 'Save Student Record'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
