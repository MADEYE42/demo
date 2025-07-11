'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChatPage() {
  const { id } = useParams(); // project ID
  const router = useRouter();
  type Message = { sender: string; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('An error occurred while fetching messages');
    }
  };

  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newMsg }),
      });
      if (res.ok) {
        setNewMsg('');
        fetchMessages();
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('An error occurred while sending the message');
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
    fetchMessages();
  }, []);

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
        <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
            💬 Chat - Project #{id}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            Communicate with the team about this project
          </p>

          <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700">
            {messages.map((msg, i) => (
              <div
                key={i}
                className="p-3 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <p className="text-sm">
                  <strong className="text-teal-600 dark:text-teal-400">{msg.sender}</strong>: {msg.text}
                </p>
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
            >
              Send
            </button>
          </div>
        </div>
      </main>
    </>
  );
}