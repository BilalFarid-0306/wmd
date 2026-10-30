import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import StudentForm from '../components/StudentForm';
import Loader from '../components/Loader';
import { Edit2, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setFetchLoading(true);
        const res = await api.get(`/students/${id}`);
        if (res.data && res.data.student) {
          setStudent(res.data.student);
        } else {
          toast.error('Student record not found.');
          navigate('/students');
        }
      } catch (err) {
        console.error('[EditStudent Fetch Error]', err);
        toast.error('Failed to load student record.');
        navigate('/students');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const handleSubmit = async (formData) => {
    try {
      setSubmitLoading(true);
      await api.put(`/students/${id}`, formData);
      toast.success('Student record updated successfully!');
      navigate('/students');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update student record.';
      toast.error(msg);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (fetchLoading) {
    return <Loader text="Loading student record details..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/students" className="hover:text-indigo-600 transition-colors">
            Students
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/students/${id}`} className="hover:text-indigo-600 transition-colors">
            {student?.firstName} {student?.lastName}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Edit Record</span>
        </nav>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Student Record
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Modify the student information for Roll No:{' '}
              <span className="font-semibold text-indigo-600">{student?.rollNo}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <StudentForm
        initialData={student}
        onSubmit={handleSubmit}
        loading={submitLoading}
        isEdit={true}
      />
    </div>
  );
};

export default EditStudent;
