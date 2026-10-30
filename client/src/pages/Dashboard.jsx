import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import {
  Users,
  UserCheck,
  Award,
  Building2,
  ArrowRight,
  UserPlus,
  TrendingUp,
  Clock,
  Eye,
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    avgCgpa: 0,
    countByDepartment: [],
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, studentsRes] = await Promise.all([
          api.get('/students/stats/summary'),
          api.get('/students?limit=5&sortBy=createdAt&order=desc'),
        ]);

        if (statsRes.data) {
          setStats(statsRes.data);
        }
        if (studentsRes.data && studentsRes.data.students) {
          setRecentStudents(studentsRes.data.students);
        }
      } catch (err) {
        console.error('[Dashboard Error]', err);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <Loader text="Loading dashboard analytics..." />;
  }

  const totalDepts = stats.countByDepartment?.length || 0;
  const maxDeptCount = Math.max(
    ...((stats.countByDepartment || []).map((d) => d.count)),
    1
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Welcome Banner with solid fallback and proper Tailwind v3 gradient */}
      <div className="bg-indigo-700 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-indigo-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Dashboard Overview
          </h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Welcome to EduRecord. Monitor department allocations, enrollment status, and academic performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/students/new"
            className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold text-sm rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-indigo-700" />
            <span>Add Student</span>
          </Link>
          <Link
            to="/students"
            className="px-4 py-2.5 bg-indigo-500/40 hover:bg-indigo-500/60 text-white font-semibold text-sm rounded-xl transition-all border border-indigo-300/30 flex items-center gap-2"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </Link>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon={Users}
          color="indigo"
          subtitle="Enrolled database records"
        />
        <StatCard
          title="Active Students"
          value={stats.activeStudents}
          icon={UserCheck}
          color="emerald"
          subtitle={`${
            stats.totalStudents > 0
              ? Math.round((stats.activeStudents / stats.totalStudents) * 100)
              : 0
          }% active enrollment`}
        />
        <StatCard
          title="Average CGPA"
          value={stats.avgCgpa ? stats.avgCgpa.toFixed(2) : '0.00'}
          icon={Award}
          color="amber"
          subtitle="Overall academic standard"
        />
        <StatCard
          title="Departments"
          value={totalDepts}
          icon={Building2}
          color="violet"
          subtitle="Academic faculties active"
        />
      </div>

      {/* Two Column Layout: Department Distribution & Recent Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Department Distribution */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Department Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Student distribution across faculties
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                {totalDepts} Faculties
              </span>
            </div>

            {stats.countByDepartment && stats.countByDepartment.length > 0 ? (
              <div className="space-y-4">
                {stats.countByDepartment.map((item) => {
                  const percentage = Math.round((item.count / maxDeptCount) * 100);
                  const totalPercent = stats.totalStudents > 0
                    ? Math.round((item.count / stats.totalStudents) * 100)
                    : 0;

                  return (
                    <div key={item.department} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium">
                        <span className="font-semibold text-slate-800">
                          {item.department}
                        </span>
                        <span className="text-slate-500">
                          {item.count} students ({totalPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">
                No department data available.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Aggregated from live records</span>
            <Link to="/students" className="text-indigo-600 hover:underline font-semibold">
              Filter by faculty &rarr;
            </Link>
          </div>
        </div>

        {/* Recently Added Students */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Recently Added Students
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest 5 entries registered in the system
                </p>
              </div>
              <Link
                to="/students"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                      <th className="pb-3">Roll No</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Dept</th>
                      <th className="pb-3">Year</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 font-semibold text-indigo-600">
                          {student.rollNo}
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-800">
                            {student.firstName} {student.lastName}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                            {student.department}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600 font-medium">
                          Year {student.year}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/students/${student._id}`}
                            className="p-1 inline-flex text-slate-400 hover:text-indigo-600 transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">
                No recent students found.
              </p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-right">
            <Link
              to="/students/new"
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              + Register another student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
