'use client';

import { useEffect, useState, useCallback } from 'react'; // <--- Import useCallback
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Project = {
  _id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  status?: string;
  createdAt?: string;
};

export default function ManufacturerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // --- Wrap fetchProjects in useCallback ---
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/projects/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }, [token]); // <--- Add 'token' as a dependency

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manufacturer') window.location.href = '/login';
    fetchProjects();
  }, [fetchProjects]); // 'fetchProjects' is now a stable dependency

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
            🛠 My Projects
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Manage your assigned projects and communications
          </p>

          {loading ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center">No projects assigned yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
                >
                  <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-2">
                    {project.title || 'Untitled Project'}
                  </h2>

                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
                  )}

                  {project.fileUrl && (
                    <a
                      href={project.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-500 underline block mb-2"
                    >
                      View Uploaded File
                    </a>
                  )}

                  <p className="text-sm mb-3">
                    <span className="font-medium text-gray-700 dark:text-gray-200">Status:</span>{' '}
                    <span className="uppercase text-teal-600 dark:text-teal-400 font-semibold">
                      {project.status || 'PENDING'}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <Link
                      href={`/dashboard/manufacturer/notes/${project._id}`}
                      className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300 text-sm"
                    >
                      Manage Notes
                    </Link>
                    <Link
                      href={`/dashboard/manufacturer/messages/${project._id}`}
                      className="px-4 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300 text-sm"
                    >
                      Open Chat
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}