'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'client') {
      router.push('/login');
    }

    const name = localStorage.getItem('name');
    if (name) setUserName(name);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-6 font-sans">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            Welcome, {userName || 'Client'} 👋
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Manage your fabrication projects with ease
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Upload Project Card */}
            <div
              onClick={() => router.push('/dashboard/client/upload')}
              className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">📤 Upload New Project</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Submit your fabrication designs, documents, and instructions.
              </p>
            </div>

            {/* View Projects Card */}
            <div
              onClick={() => router.push('/dashboard/client/projects')}
              className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">📁 My Projects</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track progress and view submitted projects with status updates.
              </p>
            </div>

            {/* View Messages Card */}
            <div
              onClick={() => router.push('/dashboard/client/projects')}
              className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">🔔 My Messages</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Track messages and view unread messages.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}