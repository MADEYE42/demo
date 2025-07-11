"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "client") {
      router.push("/login");
    }

    // Fetch user profile if needed (Optional)
    const name = localStorage.getItem("name");
    if (name) setUserName(name);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName || "Client"} 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Project Card */}
        <div
          onClick={() => router.push("/dashboard/client/upload")}
          className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer transition"
        >
          <h2 className="text-xl font-semibold mb-2">📤 Upload New Project</h2>
          <p className="text-gray-600">Submit your fabrication designs, documents, and instructions.</p>
        </div>

        {/* View Projects Card */}
        <div
          onClick={() => router.push("/dashboard/client/projects")}
          className="p-6 border rounded-lg shadow hover:shadow-lg cursor-pointer transition"
        >
          <h2 className="text-xl font-semibold mb-2">📁 My Projects</h2>
          <p className="text-gray-600">Track progress and view submitted projects with status updates.</p>
        </div>
      </div>
    </div>
  );
}
