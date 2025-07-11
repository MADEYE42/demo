'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UploadProjectPage() {
  const [form, setForm] = useState({ title: '', description: '', fileUrl: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('/api/projects/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        alert('Project Uploaded');
        router.push('/dashboard/client/projects');
      } else {
        const data = await res.json();
        setError(data.msg || 'Project upload failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-6 font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
          Upload New Project
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Submit your fabrication project details
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Project Title
            </label>
            <input
              id="title"
              placeholder="Enter project title"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Project Description
            </label>
            <textarea
              id="description"
              placeholder="Enter project description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="fileUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              File URL (CAD/PDF)
            </label>
            <input
              id="fileUrl"
              placeholder="Enter file URL"
              required
              value={form.fileUrl}
              onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
        >
          Upload
        </button>
      </form>
    </main>
  );
}