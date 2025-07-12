'use client';

import { useEffect, useState } from 'react';

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
    <main>
      <div>
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
  );
}