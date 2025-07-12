'use client';

import { useEffect, useState, useCallback } from 'react'; // <--- Import useCallback
import { useRouter } from 'next/navigation';

interface Entry {
  _id: string;
  material: string;
  quantity: number;
  type: 'in' | 'out';
  createdAt: string;
}

export default function InventoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ material: '', quantity: 0, type: 'in' });
  const [error, setError] = useState('');
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  // --- Wrap fetchEntries in useCallback ---
  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/inventory/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEntries(data.entries || []);
    } catch {
      setError('Failed to fetch inventory entries');
    }
  }, [token]); // <--- Add 'token' as a dependency for useCallback, as fetchEntries uses it.

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ material: '', quantity: 0, type: 'in' });
        fetchEntries();
      } else {
        setError('Failed to add inventory entry');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'manufacturer') window.location.href = '/login';
    fetchEntries();
  }, [fetchEntries]); // 'fetchEntries' is now a stable dependency due to useCallback

  const calculateStock = () => {
    const stockMap = new Map<string, number>();
    for (const entry of entries) {
      const prev = stockMap.get(entry.material) || 0;
      stockMap.set(entry.material, prev + (entry.type === 'in' ? entry.quantity : -entry.quantity));
    }
    return stockMap;
  };

  const stock = calculateStock();

  return (
    <>
      <header className="w-full px-6 md:px-12 py-6 flex justify-between items-center bg-white dark:bg-gray-800 shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-teal-600 dark:text-teal-400">
          🏗️ SteelFabPro
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
        >
          Logout
        </button>
      </header>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            📦 Inventory Management
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Log and monitor your material inventory
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border border-gray-300 dark:border-gray-600">
            <div>
              <label htmlFor="material" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Material Name
              </label>
              <input
                id="material"
                required
                placeholder="Enter material name"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                value={form.material}
                onChange={(e) => setForm({ ...form, material: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Quantity
              </label>
              <input
                id="quantity"
                required
                type="number"
                placeholder="Enter quantity"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Type
              </label>
              <select
                id="type"
                className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="in">Material In</option>
                <option value="out">Material Out</option>
              </select>
            </div>
            {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
            >
              Add Entry
            </button>
          </form>

          {/* Stock Summary */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📊 Current Stock Levels</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...stock.entries()].map(([material, qty]) => (
                <div
                  key={material}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg"
                >
                  <p>
                    <strong className="text-teal-600 dark:text-teal-400">{material}</strong>: {qty} units
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Entry Log */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-teal-600 dark:text-teal-400">📜 Inventory Log</h2>
            <ul className="space-y-3">
              {entries.map((entry) => (
                <li
                  key={entry._id}
                  className="p-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-teal-900 transition-all duration-300 shadow hover:shadow-lg flex justify-between items-center"
                >
                  <span>
                    <strong className="text-teal-600 dark:text-teal-400">{entry.material}</strong> - {entry.quantity} units (
                    {entry.type === 'in' ? 'IN' : 'OUT'})
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
