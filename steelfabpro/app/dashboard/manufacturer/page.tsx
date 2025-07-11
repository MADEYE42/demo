"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ManufacturerDashboard() {
  const [name, setName] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("name");
    if (role !== "manufacturer") window.location.href = "/login";
    setName(username || "Manufacturer");
  }, []);

  return (
    <div className="min-h-screen p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-3xl font-bold text-red-900">Welcome, {name} 👷‍♂️</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/dashboard/manufacturer/inventory">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md hover:bg-slate-100 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📦 Inventory</h2>
              <p className="text-gray-600">Log and monitor materials</p>
            </div>
          </Link>

          <Link href="/dashboard/manufacturer/projects">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md hover:bg-slate-100 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">🛠 Projects</h2>
              <p className="text-gray-600">Manage tasks & milestones</p>
            </div>
          </Link>

          <Link href="/dashboard/manufacturer/notes">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md hover:bg-slate-100 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">📝 Notes / OCR</h2>
              <p className="text-gray-600">Upload handwritten notes</p>
            </div>
          </Link>

          <Link href="/dashboard/manufacturer/messages">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-md hover:bg-slate-100 transition cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">💬 Messaging</h2>
              <p className="text-gray-600">Chat with clients</p>
            </div>
          </Link>
        </div>

        {/* Optional: Status summary */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-2">🔍 Quick Tips</h3>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Log all materials in/out under Inventory</li>
            <li>Update project status regularly for admin/client visibility</li>
            <li>Use OCR upload to digitize work orders or field notes</li>
            <li>Communicate through secure messaging channels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
