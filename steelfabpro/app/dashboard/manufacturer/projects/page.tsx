"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Project = {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string;
};

export default function ManufacturerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "manufacturer") window.location.href = "/login";
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-red-900 mb-6">🛠 My Projects</h1>

        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl p-6 border shadow-sm hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold mb-1">{project.name}</h2>
                {project.description && (
                  <p className="text-gray-600 mb-2">{project.description}</p>
                )}
                <p className="text-sm mb-3">
                  <span className="font-medium">Status:</span>{" "}
                  <span className="uppercase text-red-700 font-semibold">
                    {project.status || "PENDING"}
                  </span>
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <Link
                    href={`/dashboard/manufacturer/notes/${project._id}`}
                    className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 text-sm"
                  >
                    Manage Notes
                  </Link>
                  <Link
                    href={`/dashboard/manufacturer/messages/${project._id}`}
                    className="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 text-sm"
                  >
                    Open Chat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
