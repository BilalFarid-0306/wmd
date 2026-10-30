import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StudentTable from '../components/StudentTable';
import Pagination from '../components/Pagination';
import ConfirmModal from '../components/ConfirmModal';
import {
  Search,
  UserPlus,
  Filter,
  RotateCcw,
  Users,
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['All', 'CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'Other'];
const YEARS = ['All', '1', '2', '3', '4'];
const STATUSES = ['All', 'Active', 'Inactive', 'Graduated'];

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Sorting state
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  // Deletion modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search term by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset to page 1 on new search
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch students function
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit,
        sortBy,
        order,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }
      if (selectedDept !== 'All') {
        params.department = selectedDept;
      }
      if (selectedYear !== 'All') {
        params.year = selectedYear;
      }
      if (selectedStatus !== 'All') {
        params.status = selectedStatus;
      }

      const res = await api.get('/students', { params });
      if (res.data) {
        setStudents(res.data.students || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('[Fetch Students Error]', err);
      toast.error('Failed to load students list.');
    } finally {
      setLoading(false);
    }
  }, [page, limit, sortBy, order, debouncedSearch, selectedDept, selectedYear, selectedStatus]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle Sort Column Toggle
  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setOrder('asc');
    }
    setPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedDept('All');
    setSelectedYear('All');
    setSelectedStatus('All');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  // Initiate Deletion
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  // Confirm Deletion
  const handleConfirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      setDeleteLoading(true);
      await api.delete(`/students/${studentToDelete._id}`);
      toast.success(`Student ${studentToDelete.firstName} ${studentToDelete.lastName} removed.`);
      setDeleteModalOpen(false);
      setStudentToDelete(null);
      // Refresh students
      fetchStudents();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete student.';
      toast.error(msg);
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasActiveFilters =
    searchTerm ||
    selectedDept !== 'All' ||
    selectedYear !== 'All' ||
    selectedStatus !== 'All';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Student Records
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, filter, and manage all student enrollment profiles.
          </p>
        </div>
        <Link
          to="/students/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Student</span>
        </Link>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by name, roll no, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Department Filter */}
          <div className="lg:col-span-3">
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => {
                  setSelectedDept(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === 'All' ? 'Department: All' : dept}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Year Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              {YEARS.map((yr) => (
                <option key={yr} value={yr}>
                  {yr === 'All' ? 'Year: All' : `Year ${yr}`}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'Status: All' : st}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="lg:col-span-1 flex items-center justify-end">
            <button
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Reset all filters"
              type="button"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Active Filters feedback */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <div>
            Showing total <span className="font-semibold text-slate-800">{total}</span> matching records
          </div>
          {hasActiveFilters && (
            <div className="text-indigo-600 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filters actively applied</span>
            </div>
          )}
        </div>
      </div>

      {/* Student Table & Pagination Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <StudentTable
          students={students}
          loading={loading}
          sortBy={sortBy}
          order={order}
          onSort={handleSort}
          onDelete={handleDeleteClick}
        />
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
          totalItems={total}
          itemsPerPage={limit}
        />
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete ${studentToDelete?.firstName} ${studentToDelete?.lastName} (${studentToDelete?.rollNo})? This action cannot be reversed.`}
        confirmText="Confirm Delete"
        cancelText="Cancel"
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
      />
    </div>
  );
};

export default Students;
