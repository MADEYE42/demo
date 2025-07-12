'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Project = {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  status: string;
  manufacturerId?: {
    name?: string;
  };
};

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('/api/projects/list', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects ?? []));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <>
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          🏗️ SteelFabPro
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
          >
            Back
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            📁 My Projects
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            View and track your submitted projects
          </p>

          <ul className="space-y-4">
            {projects.map((project: Project) => (
              <li
                key={project._id}
                className="p-6 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold text-teal-600 dark:text-teal-400">{project.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{project.description}</p>
                <a
                  href={project.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 hover:underline mt-2 inline-block"
                >
                  View File
                </a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Status: {project.status}
                  {project.manufacturerId?.name && (
                    <> • Assigned to: <strong>{project.manufacturerId.name}</strong></>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}