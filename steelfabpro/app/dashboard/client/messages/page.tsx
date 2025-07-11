'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ClientChatPage() {
  const { id: projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ projectId }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      } else {
        setError('Failed to fetch messages');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: text, projectId }),
      });

      if (res.ok) {
        setText('');
        fetchMessages();
      } else {
        setError('Failed to send message');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'client') window.location.href = '/login';

    fetchMessages();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 font-sans">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-teal-600 dark:text-teal-400">
          📨 Project Chat
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
          Communicate with the team about your project
        </p>

        <div className="h-96 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-2 bg-gray-50 dark:bg-gray-700">
          {messages.map((msg: any) => (
            <div
              key={msg._id}
              className={`p-3 rounded-lg max-w-xs ${
                msg.senderId.role === 'client'
                  ? 'bg-teal-100 dark:bg-teal-900 ml-auto'
                  : 'bg-gray-100 dark:bg-gray-600'
              }`}
            >
              <p className="text-sm text-gray-900 dark:text-gray-100">{msg.content}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{msg.senderId.name}</p>
            </div>
          ))}
        </div>

        {error && <p className="text-red-500 dark:text-red-400 text-sm text-center">{error}</p>}

        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors duration-300"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 dark:hover:bg-teal-500 transition-all duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}