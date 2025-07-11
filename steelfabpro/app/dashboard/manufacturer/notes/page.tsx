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

export default function ManufacturerNotesSelectorPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "manufacturer") {
      window.location.href = "/login";
    } else {
      fetchProjects();
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-red-900 mb-6">
          📝 OCR Notes - Select Project
        </h1>

        {loading ? (
          <p className="text-gray-600">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-600">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold text-slate-800 mb-2">
                  {project.name || "Untitled Project"}
                </h2>
                {project.description && (
                  <p className="text-gray-600 mb-2 text-sm">
                    {project.description}
                  </p>
                )}
                {project.status && (
                  <p className="text-sm mb-2">
                    <span className="font-medium text-gray-700">Status:</span>{" "}
                    <span className="uppercase text-red-700 font-semibold">
                      {project.status}
                    </span>
                  </p>
                )}
                <Link
                  href={`/dashboard/manufacturer/notes/${project._id}`}
                  className="inline-block mt-4 bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800 transition text-sm font-medium"
                >
                  View Notes
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
