import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';
import ConfirmModal from '../components/ConfirmModal';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap,
  Award,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusBadgeStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-amber-50 text-amber-700 border-amber-200',
  Graduated: 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/students/${id}`);
        if (res.data && res.data.student) {
          setStudent(res.data.student);
        } else {
          toast.error('Student profile not found.');
          navigate('/students');
        }
      } catch (err) {
        console.error('[StudentDetails Fetch Error]', err);
        toast.error('Failed to load student details.');
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/students/${id}`);
      toast.success('Student record deleted successfully.');
      navigate('/students');
    } catch (err) {
      toast.error('Failed to delete student record.');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <Loader text="Loading student record details..." />;
  }

  if (!student) return null;

  const badgeClass =
    statusBadgeStyles[student.status] ||
    'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          type="button"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students List</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/students/edit/${student._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            <span>Edit Profile</span>
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm rounded-xl border border-rose-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Banner with avatar & top info */}
        <div className="bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-4 border-white/10 flex items-center justify-center font-bold text-2xl text-white shadow-xl">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  {student.firstName} {student.lastName}
                </h1>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
                >
                  {student.status}
                </span>
              </div>
              <p className="text-indigo-200 font-mono text-sm">
                Roll No: <span className="text-white font-bold">{student.rollNo}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Academic Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Department</p>
                <p className="text-base font-bold text-slate-900">{student.department}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Academic Year</p>
                <p className="text-base font-bold text-slate-900">Year {student.year} of 4</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">Cumulative GPA</p>
                <p className="text-base font-bold text-slate-900">
                  {student.cgpa.toFixed(2)}{' '}
                  <span className="text-xs font-normal text-slate-500">/ 10.0</span>
                </p>
              </div>
            </div>
          </div>

          {/* Personal and Contact Information */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Personal & Contact Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50/60 rounded-2xl p-5 border border-slate-100">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-slate-800 break-all">
                    {student.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Phone Number</p>
                  <p className="text-sm font-semibold text-slate-800">
                    +91 {student.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <UserCheck className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Gender</p>
                  <p className="text-sm font-semibold text-slate-800">{student.gender}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Date of Birth</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {student.dateOfBirth
                      ? new Date(student.dateOfBirth).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 pt-2 border-t border-slate-200/60">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Residential Address</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {student.address || 'No residential address provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Metadata */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                Registered on{' '}
                {new Date(student.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span>
                Last updated:{' '}
                {new Date(student.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Student Record"
        message={`Are you sure you want to delete ${student.firstName} ${student.lastName}? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
      />
    </div>
  );
};

export default StudentDetails;
