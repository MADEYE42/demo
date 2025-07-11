import React from 'react';

  export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-3xl bg-white p-10 rounded-xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-red-900">SteelFabPro</h1>
        <p className="text-lg text-gray-700">
          A unified digital platform for the Steel Fabrication Industry — connecting Clients,
          Manufacturers, and Admins to streamline projects, manage inventory, communicate efficiently,
          and boost productivity.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/register"
            className="px-6 py-3 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-800 transition"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-6 py-3 border border-red-900 text-red-900 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            Login
          </a>
        </div>

        <div className="text-sm text-gray-500 mt-6">
          <p>🔐 Secure Role-Based Access</p>
          <p>📦 Inventory & Project Tracking</p>
          <p>💬 Messaging, Notes, and Reports</p>
        </div>
      </div>
    </main>
  );
}
