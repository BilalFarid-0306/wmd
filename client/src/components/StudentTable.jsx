import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit2, Trash2, ArrowUpDown, ArrowUp, ArrowDown, UserX } from 'lucide-react';

const statusBadgeStyles = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  Inactive: 'bg-amber-50 text-amber-700 border-amber-200/80',
  Graduated: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
};

const StudentTable = ({
  students,
  loading,
  sortBy,
  order,
  onSort,
  onDelete,
}) => {
  const renderSortIcon = (field) => {
    if (sortBy !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />;
    }
    return order === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-indigo-600" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-indigo-600" />
    );
  };

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex items-center justify-between gap-4">
            <div className="h-4 bg-slate-200 rounded-sm w-20"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-40"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-24"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-12"></div>
            <div className="h-4 bg-slate-200 rounded-sm w-12"></div>
            <div className="h-6 bg-slate-200 rounded-full w-16"></div>
            <div className="h-6 bg-slate-200 rounded-sm w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
          <UserX className="w-8 h-8" />
        </div>
        <h4 className="text-base font-bold text-slate-800">No students found</h4>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          No records match your criteria. Try adjusting your search query or reset the active filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th
              onClick={() => onSort('rollNo')}
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Roll No</span>
                {renderSortIcon('rollNo')}
              </div>
            </th>
            <th
              onClick={() => onSort('firstName')}
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Name</span>
                {renderSortIcon('firstName')}
              </div>
            </th>
            <th
              onClick={() => onSort('department')}
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none"
            >
              <div className="flex items-center gap-1.5">
                <span>Department</span>
                {renderSortIcon('department')}
              </div>
            </th>
            <th
              onClick={() => onSort('year')}
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none text-center"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>Year</span>
                {renderSortIcon('year')}
              </div>
            </th>
            <th
              onClick={() => onSort('cgpa')}
              className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none text-center"
            >
              <div className="flex items-center justify-center gap-1.5">
                <span>CGPA</span>
                {renderSortIcon('cgpa')}
              </div>
            </th>
            <th className="py-3.5 px-4 text-center">Status</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {students.map((student) => {
            const badgeClass =
              statusBadgeStyles[student.status] ||
              'bg-slate-100 text-slate-700 border-slate-200';

            return (
              <tr
                key={student._id}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                <td className="py-3.5 px-4 font-semibold text-indigo-700 tracking-wide">
                  {student.rollNo}
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-medium text-slate-900">
                    {student.firstName} {student.lastName}
                  </div>
                  <div className="text-xs text-slate-400">{student.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-block px-2.5 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md border border-slate-200/60">
                    {student.department}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                  Year {student.year}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`font-semibold text-sm ${
                      student.cgpa >= 8.5
                        ? 'text-emerald-600'
                        : student.cgpa >= 7.0
                        ? 'text-indigo-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {student.cgpa.toFixed(2)}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeClass}`}
                  >
                    {student.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Link
                      to={`/students/${student._id}`}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="View Student Profile"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/students/edit/${student._id}`}
                      className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="Edit Student Record"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(student)}
                      type="button"
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Student Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
