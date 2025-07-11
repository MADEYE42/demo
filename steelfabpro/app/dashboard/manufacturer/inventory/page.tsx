"use client";

import { useEffect, useState } from "react";

interface Entry {
  _id: string;
  material: string;
  quantity: number;
  type: "in" | "out";
  createdAt: string;
}

export default function InventoryPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState({ material: "", quantity: 0, type: "in" });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchEntries = async () => {
    const res = await fetch("/api/inventory/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setEntries(data.entries);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/inventory/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ material: "", quantity: 0, type: "in" });
      fetchEntries();
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "manufacturer") window.location.href = "/login";
    fetchEntries();
  }, []);

  const calculateStock = () => {
    const stockMap = new Map<string, number>();
    for (const entry of entries) {
      const prev = stockMap.get(entry.material) || 0;
      stockMap.set(entry.material, prev + (entry.type === "in" ? entry.quantity : -entry.quantity));
    }
    return stockMap;
  };

  const stock = calculateStock();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Inventory Management</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 border p-4 rounded">
        <input
          required
          placeholder="Material Name"
          className="border w-full p-2"
          value={form.material}
          onChange={(e) => setForm({ ...form, material: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Quantity"
          className="border w-full p-2"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
        />
        <select
          className="border p-2 w-full"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="in">Material In</option>
          <option value="out">Material Out</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Add Entry
        </button>
      </form>

      {/* Stock Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">📊 Current Stock Levels</h2>
        {[...stock.entries()].map(([material, qty]) => (
          <p key={material} className="text-gray-700">
            {material}: <strong>{qty}</strong> units
          </p>
        ))}
      </div>

      {/* Entry Log */}
      <div>
        <h2 className="text-lg font-semibold mb-2">📜 Inventory Log</h2>
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li
              key={entry._id}
              className="border p-3 rounded flex justify-between items-center bg-white"
            >
              <span>
                <strong>{entry.material}</strong> - {entry.quantity} units (
                {entry.type === "in" ? "IN" : "OUT"})
              </span>
              <span className="text-sm text-gray-500">
                {new Date(entry.createdAt).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
