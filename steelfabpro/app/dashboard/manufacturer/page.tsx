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
    if (role !== 'manufacturer') router.push('/login');
    setName(username || 'Manufacturer');
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <>
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">
          🏗️ SteelFabPro
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-10">
          {/* Welcome */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              Welcome, {name} 👷‍♂️
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage your manufacturing tasks and communications
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <DashboardCard
              href="/dashboard/manufacturer/inventory"
              icon="📦"
              title="Inventory"
              desc="Log and monitor materials"
            />
            <DashboardCard
              href="/dashboard/manufacturer/projects"
              icon="🛠"
              title="Projects"
              desc="Manage tasks & milestones"
            />
            <DashboardCard
              href="/dashboard/manufacturer/messages"
              icon="💬"
              title="Messaging"
              desc="Chat with clients"
            />
            <DashboardCard
              href="/dashboard/manufacturer/all-projects"
              icon="📋"
              title="All Projects"
              desc="Review & accept new projects"
            />
          </div>

          {/* Quick Tips */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-teal-600 dark:text-teal-400">
              🔍 Quick Tips
            </h3>
            <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 space-y-1 text-sm">
              <li>Log all materials in/out under Inventory</li>
              <li>Update project status regularly for Admin & Client visibility</li>
              <li>Use OCR to digitize work orders or site instructions</li>
              <li>Communicate clearly via secure messages</li>
              <li>Check new projects under “All Projects” to expand work</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}

type DashboardCardProps = {
  href: string;
  icon: string;
  title: string;
  desc: string;
};

function DashboardCard({ href, icon, title, desc }: DashboardCardProps) {
  return (
    <Link href={href}>
      <div className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg">
        <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">
          {icon} {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">{desc}</p>
      </div>
    </Link>
  );
}
