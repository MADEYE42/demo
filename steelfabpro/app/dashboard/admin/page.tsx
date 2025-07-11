"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [inventory, setInventory] = useState([]);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const [uRes, pRes, iRes] = await Promise.all([
      fetch("/api/admin/users", { headers }),
      fetch("/api/admin/projects", { headers }),
      fetch("/api/admin/inventory", { headers }),
    ]);

    const usersData = await uRes.json();
    const projectData = await pRes.json();
    const inventoryData = await iRes.json();

    setUsers(usersData.users);
    setProjects(projectData.projects);
    setInventory(inventoryData.entries);
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") window.location.href = "/login";
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">🛠️ Admin Dashboard</h1>

      {/* USERS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">👥 All Users</h2>
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* PROJECTS */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📁 All Projects</h2>
        <ul className="space-y-2">
          {projects.map((p: any) => (
            <li key={p._id} className="border p-3 rounded bg-white shadow-sm">
              <strong>{p.title}</strong> - {p.description}
              <p className="text-sm text-gray-600">
                Submitted by: {p.clientId?.name} ({p.clientId?.email}) | Status: {p.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* INVENTORY */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📦 Inventory Logs</h2>
        <ul className="space-y-2">
          {inventory.map((e: any) => (
            <li key={e._id} className="border p-3 rounded bg-white shadow-sm">
              <strong>{e.material}</strong> - {e.quantity} ({e.type.toUpperCase()})
              <p className="text-sm text-gray-600">
                By: {e.manufacturerId?.name} ({e.manufacturerId?.email}) at{" "}
                {new Date(e.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
