'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const COLORS = ['#00C49F', '#FF8042'];

export default function AdminAnalytics() {
  const [summary, setSummary] = useState({ userCount: 0, projectCount: 0, inventoryCount: 0 });
  const [projectData, setProjectData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchAll = useCallback(async () => {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [s, p, i] = await Promise.all([
        fetch('/api/analytics/summary', { headers }).then(res => res.json()),
        fetch('/api/analytics/chart/projects', { headers }).then(res => res.json()),
        fetch('/api/analytics/chart/inventory', { headers }).then(res => res.json()),
      ]);

      setSummary(s);
      setProjectData(
        p.data.map((d: unknown) => {
          const { _id, count } = d as { _id: string; count: number };
          return { date: _id, count };
        })
      );
      setInventoryData(
        i.data.map((d: unknown) => {
          const { _id, total } = d as { _id: string; total: number };
          return { name: _id.toUpperCase(), value: total };
        })
      );
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') window.location.href = '/login';
    fetchAll();
  }, [fetchAll]);

  return (
    <>
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          🏗️ SteelFabPro
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
        >
          Logout
        </button>
      </header>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            📊 Analytics Dashboard
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            View insights and metrics for users, projects, and inventory
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">👥 Users</h2>
              <p className="text-2xl text-gray-900 dark:text-gray-100">{summary.userCount}</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📁 Projects</h2>
              <p className="text-2xl text-gray-900 dark:text-gray-100">{summary.projectCount}</p>
            </div>
            <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📦 Inventory Logs</h2>
              <p className="text-2xl text-gray-900 dark:text-gray-100">{summary.inventoryCount}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Project Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400">📈 Project Submissions by Date</h3>
              <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectData}>
                    <XAxis dataKey="date" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#D1D5DB" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        color: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inventory Chart */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400">📉 Inventory IN vs OUT</h3>
              <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={inventoryData} dataKey="value" nameKey="name" outerRadius={100}>
                      {inventoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        color: '#F3F4F6',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
