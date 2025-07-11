'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManufacturerDashboard() {
  const [name, setName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('name');
    if (role !== 'manufacturer') window.location.href = '/login';
    setName(username || 'Manufacturer');
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
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            Welcome, {name} 👷‍♂️
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Manage your manufacturing tasks and communications
          </p>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/dashboard/manufacturer/inventory">
              <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">📦 Inventory</h2>
                <p className="text-gray-600 dark:text-gray-300">Log and monitor materials</p>
              </div>
            </Link>

            <Link href="/dashboard/manufacturer/projects">
              <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">🛠 Projects</h2>
                <p className="text-gray-600 dark:text-gray-300">Manage tasks & milestones</p>
              </div>
            </Link>

            <Link href="/dashboard/manufacturer/notes">
              <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">📝 Notes / OCR</h2>
                <p className="text-gray-600 dark:text-gray-300">Upload handwritten notes</p>
              </div>
            </Link>

            <Link href="/dashboard/manufacturer/messages">
              <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg">
                <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">💬 Messaging</h2>
                <p className="text-gray-600 dark:text-gray-300">Chat with clients</p>
              </div>
            </Link>
          </div>

          {/* Quick Tips */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-teal-600 dark:text-teal-400">🔍 Quick Tips</h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300">
              <li>Log all materials in/out under Inventory</li>
              <li>Update project status regularly for admin/client visibility</li>
              <li>Use OCR upload to digitize work orders or field notes</li>
              <li>Communicate through secure messaging channels</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}