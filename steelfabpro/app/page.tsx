'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(prefersDark);
    document.documentElement.classList.toggle('dark', prefersDark);
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 flex flex-col font-sans">
      
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          🏗️ SteelFabPro
        </h1>
        <div className="flex items-center gap-6">
          <nav className="space-x-6 text-sm font-medium">
            <a href="/login" className="hover:text-teal-500 dark:hover:text-teal-300 transition-colors">Login</a>
            <a href="/register" className="hover:text-teal-500 dark:hover:text-teal-300 transition-colors">Register</a>
          </nav>
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col-reverse md:flex-row items-center justify-between gap-12 px-6 md:px-16 py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        {/* Left Section */}
        <div className="text-left max-w-lg space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
            Welcome to <span className="text-teal-600 dark:text-teal-400">SteelFabPro</span> 🚀
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            A unified digital platform for the Steel Fabrication Industry — seamlessly connecting Clients,
            Manufacturers, and Admins to streamline projects, manage inventory, communicate efficiently,
            and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="/register"
              className="px-8 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
            >
              ✨ Get Started
            </a>
            <a
              href="/login"
              className="px-8 py-3 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            >
              🔐 Login
            </a>
          </div>
        </div>

        {/* Right Widgets */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-sm">
          {[
            ['🔐', 'Role-Based Access'],
            ['📦', 'Inventory Tracking'],
            ['💬', 'Notes & Reports'],
            ['📊', 'Project Tracking'],
          ].map(([icon, text], i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md text-center hover:shadow-xl transition-shadow duration-300"
            >
              <p className="text-3xl">{icon}</p>
              <p className="font-semibold text-gray-700 dark:text-gray-200 mt-3">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 shadow-inner">
        © {new Date().getFullYear()} SteelFabPro. All rights reserved.
      </footer>
    </main>
  );
}