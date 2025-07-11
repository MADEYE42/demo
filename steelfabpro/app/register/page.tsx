'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'client' });
  const [error, setError] = useState('');
  const router = useRouter();

  interface RegisterForm {
    name: string;
    email: string;
    password: string;
    role: string;
  }

  interface RegisterResponse {
    msg?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Basic client-side validation
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        router.push('/login');
      } else {
        const data: RegisterResponse = await res.json();
        setError(data.msg || 'Registration failed');
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
          Register for SteelFabPro
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Create your account to get started
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Name
            </label>
            <input
              id="name"
              placeholder="Enter your name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              id="email"
              placeholder="Enter your email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              placeholder="Enter your password"
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Role
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            >
              <option value="client">Client</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <a href="/login" className="text-teal-600 dark:text-teal-400 hover:underline">
            Login
          </a>
        </p>
      </form>
    </main>
  );
}