'use client';

import { useEffect, useState, useCallback } from 'react'; // Import useCallback
import { useRouter } from 'next/navigation';

type Project = {
  _id: string;
  title?: string;
  description?: string;
  fileUrl?: string;
};

export default function UnassignedProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // Wrap fetchUnassigned in useCallback
  const fetchUnassigned = useCallback(async () => {
    try {
      const res = await fetch('/api/projects/unassigned', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else {
        setError('Failed to fetch unassigned projects');
      }
    } catch {
      setError('An error occurred while fetching projects');
    }
  }, [token]); // Add 'token' to the dependency array, as fetchUnassigned uses it.

  const acceptProject = async (projectId: string) => {
    try {
      const res = await fetch('/api/projects/assign', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });
      if (res.ok) {
        fetchUnassigned(); // Refresh list after acceptance
      } else {
        setError('Failed to assign project');
      }
    } catch {
      setError('An error occurred while assigning the project');
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
    if (role !== 'manufacturer') window.location.href = '/login';
    fetchUnassigned();
  }, [fetchUnassigned]); // This dependency is now stable due to useCallback

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
            📋 Unassigned Projects
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Review and accept unassigned projects
          </p>

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
          {projects.map((p: Project) => (
            <div
              key={p._id}
              className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
            >
              <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">
                {p.title || 'Untitled Project'}
              </h2>

              {p.description && (
                <p className="text-gray-600 dark:text-gray-300 mb-2">{p.description}</p>
              )}

              {p.fileUrl && (
                <a
                  href={p.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-teal-500 underline block mb-2"
                >
                  View Uploaded File
                </a>
              )}

              <button
                onClick={() => acceptProject(p._id)}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300 mt-2"
              >
                Accept
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
