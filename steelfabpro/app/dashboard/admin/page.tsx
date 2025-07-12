'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';

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
  const [userSearch, setUserSearch] = useState('');
  const [projectSearch, setProjectSearch] = useState('');

  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const headers = useMemo(() => {
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const fetchData = useCallback(async () => {
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
  }, [headers]);

  const handleDeleteUser = async (id: string) => {
    await fetch(`/api/admin/users/${id}`, {
      method: 'DELETE',
      headers,
    });
    fetchData();
  };

  const handleDeleteProject = async (id: string) => {
    await fetch(`/api/admin/projects/${id}`, {
      method: 'DELETE',
      headers,
    });
    fetchData();
  };

  const handleExport = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/export/excel`, {
        method: 'GET',
        headers,
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      saveAs(blob, 'dashboard_data.xlsx');
    } catch (err) {
      console.error(`Export error:`, err);
      alert(`Failed to export Excel document.`);
    }
  }, [headers]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') window.location.href = '/login';
    fetchData();
  }, [fetchData]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(projectSearch.toLowerCase())
  );

  return (
    <>
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-teal-400">🏗️ SteelFabPro</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700"
        >
          Logout
        </button>
      </header>

      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-10">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">🛠️ Admin Dashboard</h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Manage users, projects, inventory logs, and analytics
          </p>

          {/* Dashboard Actions */}
          <div className="flex flex-wrap justify-end gap-4">
            <button
              onClick={() => router.push('/dashboard/admin/analytics')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Go to Analytics
            </button>
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Export Excel
            </button>
          </div>

          {/* USERS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">👥 All Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 mb-4"
            />
            <table className="w-full border text-sm rounded-lg">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-t dark:border-gray-600">
                    <td className="p-2">{u.name}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2">{u.role}</td>
                    <td className="p-2 text-center">
                      <button onClick={() => alert('Edit not implemented')} className="text-blue-600 mr-2">Edit</button>
                      <button onClick={() => handleDeleteUser(u._id)} className="text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* PROJECTS */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📁 All Projects</h2>
            <input
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={(e) => setProjectSearch(e.target.value)}
              className="w-full px-4 py-2 rounded border dark:border-gray-600 dark:bg-gray-700 mb-4"
            />
            <ul className="space-y-3">
              {filteredProjects.map((p) => (
                <li
                  key={p._id}
                  className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
                >
                  <h3 className="font-semibold text-lg text-teal-600 dark:text-teal-400">{p.title}</h3>
                  <p>{p.description}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Submitted by: {p.clientId?.name} ({p.clientId?.email}) | Status: {p.status}
                  </p>
                  {p.manufacturerId && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Accepted by: {p.manufacturerId.name} ({p.manufacturerId.email})
                    </p>
                  )}
                  <div className="mt-2">
                    <button onClick={() => alert('Edit not implemented')} className="text-blue-600 mr-4">Edit</button>
                    <button onClick={() => handleDeleteProject(p._id)} className="text-red-600">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* INVENTORY */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📦 Inventory Logs</h2>
            <ul className="space-y-3">
              {inventory.map((e) => (
                <li key={e._id} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                  <h3 className="font-semibold text-lg text-teal-600 dark:text-teal-400">{e.material}</h3>
                  <p>{e.quantity} ({e.type.toUpperCase()})</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By: {e.manufacturerId?.name} ({e.manufacturerId?.email}) at {new Date(e.createdAt).toLocaleString()}
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
