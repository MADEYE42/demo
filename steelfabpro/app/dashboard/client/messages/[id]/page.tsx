"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ClientChatPage() {
  const { id: projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    const res = await fetch("/api/messages/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId }),
    });

    const data = await res.json();
    setMessages(data.messages);
  };

  const sendMessage = async (e: any) => {
    e.preventDefault();

    await fetch("/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: text, projectId }),
    });

    setText("");
    fetchMessages();
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "client") window.location.href = "/login";

    fetchMessages();
  }, []);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">📨 Project Chat</h1>
      <div className="h-96 overflow-y-auto border rounded p-4 space-y-2 bg-white mb-4">
        {messages.map((msg: any) => (
          <div
            key={msg._id}
            className={`p-2 rounded max-w-xs ${
              msg.senderId.role === "client" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            }`}
          >
            <p className="text-sm">{msg.content}</p>
            <p className="text-xs text-gray-500 text-right">{msg.senderId.name}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="border w-full p-2 rounded"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">Send</button>
      </form>
    </div>
  );
}
