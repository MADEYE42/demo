'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function NotesPage() {
  const { projectId } = useParams();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchNotes = async () => {
    try {
      const res = await fetch(`/api/notes/project/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) fetchNotes();
  }, [projectId]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) return;

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectId', projectId as string);

    setUploading(true);
    setError('');

    try {
      const res = await fetch('/api/notes/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        fileInputRef.current.value = '';
        fetchNotes();
      } else {
        setError(result.msg || 'Upload failed');
      }
    } catch (err) {
      setError('Upload error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">📄 OCR Notes</h1>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            className="block w-full text-sm text-gray-700 dark:text-gray-200"
          />
          <button
            type="submit"
            disabled={uploading}
            className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
          >
            {uploading ? 'Uploading...' : 'Upload & Extract Text'}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>

        {/* Notes Section */}
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No notes found for this project.</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="p-4 border rounded-md dark:border-gray-600">
              <a
                href={note.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-500 underline"
              >
                View Uploaded Image
              </a>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
                {note.extractedText}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
