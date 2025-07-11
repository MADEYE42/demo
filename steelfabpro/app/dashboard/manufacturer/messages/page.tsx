// ✅ File: app/dashboard/manufacturer/messages/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams(); // project ID
  type Message = { sender: string; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMessages(data.messages || []);
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    await fetch(`/api/messages/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newMsg }),
    });
    setNewMsg("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">💬 Chat - Project #{id}</h1>

        <div className="h-96 overflow-y-scroll space-y-4 border p-4 rounded bg-slate-50">
          {messages.map((msg, i) => (
            <div key={i} className="bg-white p-3 rounded shadow-sm">
              <p className="text-sm text-gray-700">{msg.sender}: {msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex mt-4 gap-2">
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            placeholder="Type message..."
            className="flex-grow border px-4 py-2 rounded"
          />
          <button
            onClick={sendMessage}
            className="bg-red-900 text-white px-4 py-2 rounded hover:bg-red-800"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
