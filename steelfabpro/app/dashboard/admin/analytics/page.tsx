"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ["#00C49F", "#FF8042"];

export default function AdminAnalytics() {
  const [summary, setSummary] = useState({ userCount: 0, projectCount: 0, inventoryCount: 0 });
  const [projectData, setProjectData] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const [s, p, i] = await Promise.all([
      fetch("/api/analytics/summary", { headers }).then(res => res.json()),
      fetch("/api/analytics/chart/projects", { headers }).then(res => res.json()),
      fetch("/api/analytics/chart/inventory", { headers }).then(res => res.json()),
    ]);

    setSummary(s);
    setProjectData(p.data.map((d: any) => ({ date: d._id, count: d.count })));
    setInventoryData(i.data.map((d: any) => ({ name: d._id.toUpperCase(), value: d.total })));
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") window.location.href = "/login";
    fetchAll();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Analytics Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">👥 Users</h2>
          <p className="text-2xl">{summary.userCount}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">📁 Projects</h2>
          <p className="text-2xl">{summary.projectCount}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h2 className="text-xl font-semibold">📦 Inventory Logs</h2>
          <p className="text-2xl">{summary.inventoryCount}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Project Chart */}
        <div>
          <h3 className="text-lg font-bold mb-2">📈 Project Submissions by Date</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData}>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Chart */}
        <div>
          <h3 className="text-lg font-bold mb-2">📉 Inventory IN vs OUT</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={inventoryData} dataKey="value" nameKey="name" outerRadius={100}>
                {inventoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
