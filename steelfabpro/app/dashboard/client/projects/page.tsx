'use client';

import { useEffect, useState } from 'react';

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
          My Projects
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          View and track your submitted projects
        </p>

        <ul className="space-y-4">
          {projects.map((project: any) => (
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
  );
}