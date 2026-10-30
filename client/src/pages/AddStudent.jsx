import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import StudentForm from '../components/StudentForm';
import { UserPlus, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await api.post('/students', formData);
      toast.success('Student record created successfully!');
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create student record.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/students" className="hover:text-indigo-600 transition-colors">
            Students
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Add New Student</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Register New Student
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Fill in the academic and personal details to create a student profile.
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <StudentForm onSubmit={handleSubmit} loading={loading} isEdit={false} />
    </div>
  );
};

export default AddStudent;
