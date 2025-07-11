'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  clientId?: User;
  manufacturerId?: User;
}

interface InventoryEntry {
  _id: string;
  material: string;
  quantity: string;
  type: string;
  createdAt: string;
  manufacturerId?: User;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [uRes, pRes, iRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/projects', { headers }),
        fetch('/api/admin/inventory', { headers }),
      ]);

      const usersData = await uRes.json();
      const projectData = await pRes.json();
      const inventoryData = await iRes.json();

      setUsers(usersData.users || []);
      setProjects(projectData.projects || []);
      setInventory(inventoryData.entries || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') window.location.href = '/login';
    fetchData();
  }, []);

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
            🛠️ Admin Dashboard
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Manage users, projects, inventory logs, and analytics
          </p>

          {/* Analytics Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              onClick={() => router.push('/dashboard/admin/analytics')}
              className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 cursor-pointer transition-all duration-300 shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-2 text-teal-600 dark:text-teal-400">📊 Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300">
                View insights and metrics for users, projects, and inventory.
              </p>
            </div>
          </div>

          {/* USERS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">👥 All Users</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <tr>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">Email</th>
                    <th className="p-3 text-left font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-t border-gray-300 dark:border-gray-600 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300"
                    >
                      <td className="p-3 text-gray-900 dark:text-gray-100">{u.name}</td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">{u.email}</td>
                      <td className="p-3 text-gray-900 dark:text-gray-100">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* PROJECTS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📁 All Projects</h2>
            <ul className="space-y-3">
              {projects.map((p) => (
                <li
                  key={p._id}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400">{p.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{p.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Submitted by: {p.clientId?.name} ({p.clientId?.email}) | Status: {p.status}
                  </p>
                  {p.manufacturerId && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Accepted by: <strong>{p.manufacturerId.name}</strong> ({p.manufacturerId.email})
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {/* INVENTORY */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📦 Inventory Logs</h2>
            <ul className="space-y-3">
              {inventory.map((e) => (
                <li
                  key={e._id}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
                >
                  <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400">{e.material}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {e.quantity} ({e.type.toUpperCase()})
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    By: {e.manufacturerId?.name} ({e.manufacturerId?.email}) at{' '}
                    {new Date(e.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
