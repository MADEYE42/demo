"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UploadProjectPage() {
  const [form, setForm] = useState({ title: "", description: "", fileUrl: "" });
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const res = await fetch("/api/projects/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("Project Uploaded");
      router.push("/dashboard/client/projects");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Upload New Project</h2>
      <input
        placeholder="Project Title"
        className="w-full border p-2"
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Project Description"
        className="w-full border p-2"
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />
      <input
        placeholder="File URL (CAD/PDF)"
        className="w-full border p-2"
        onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
        required
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">
        Upload
      </button>
    </form>
  );
}
