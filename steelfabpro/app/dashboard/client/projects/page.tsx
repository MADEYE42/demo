"use client";

import { useEffect, useState } from "react";

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/projects/list", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setProjects(data.projects));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
      <ul className="space-y-4">
        {projects.map((project: any) => (
          <li key={project._id} className="border p-4 rounded shadow-sm">
            <h3 className="text-lg font-bold">{project.title}</h3>
            <p>{project.description}</p>
            <a href={project.fileUrl} target="_blank" className="text-blue-600 underline">
              View File
            </a>
            <p className="text-sm text-gray-500 mt-1">Status: {project.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
