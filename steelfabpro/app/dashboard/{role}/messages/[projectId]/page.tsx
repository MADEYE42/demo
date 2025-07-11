'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ChatPage() {
  const { projectId } = useParams();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('Error fetching messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch(`/api/messages/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (res.ok) {
        setText('');
        fetchMessages();
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('Error sending message');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    const uid = localStorage.getItem('userId');
    const userName = localStorage.getItem('name');

    if (!role || !uid || !token) {
      router.push('/login');
      return;
    }

    setRole(role);
    setUserId(uid);
    setName(userName || '');
    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            💬 Chat - Project #{projectId}
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
            {role === 'client'
              ? 'Communicate with your assigned manufacturer or admin.'
              : 'Communicate with the client or admin regarding this project.'}
          </p>

          <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-700">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg shadow-sm max-w-[80%] ${
                  msg.senderId === userId
                    ? 'bg-teal-100 dark:bg-teal-800 ml-auto text-right'
                    : 'bg-white dark:bg-gray-600 text-left'
                }`}
              >
                <p className="text-sm">
                  <strong className="text-teal-600 dark:text-teal-400">
                    {msg.senderId === userId ? 'You' : msg.senderName || msg.senderRole}
                  </strong>
                  <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </p>
                <p className="mt-1 text-gray-800 dark:text-gray-200 break-words">{msg.text}</p>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
