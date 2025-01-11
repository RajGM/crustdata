'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  console.log(process.env.NEXT_PUBLIC_BACKEND_URL);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Display user's message immediately
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);

    // Add placeholder for assistant's response
    setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);

    try {
      // Send request to your Express server
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });
      const data = await response.json();

      // Remove the loading placeholder and add the actual response
      setMessages(prev => {
        // Remove the last message if it's the loading placeholder
        const updated = prev.slice(0, -1);
        return [...updated, { role: 'assistant', content: data.answer }];
      });
    } catch (err) {
      console.error(err);
      // Remove the loading placeholder and display error message
      setMessages(prev => {
        const updated = prev.slice(0, -1);
        return [...updated, { role: 'assistant', content: 'Error: Could not get a response.' }];
      });
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-base-200" data-theme="corporate">
      {/* Header / Navbar */}
      <nav className="navbar bg-base-100 shadow w-full mb-4">
        <div className="flex-1 px-2">
          <a className="text-xl font-bold text-primary">Crustdata Support Chat</a>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl flex flex-col flex-grow p-4">
        <div className="card-body overflow-y-auto flex-1 space-y-4">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div key={idx} className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}>
                <div className={`chat-bubble ${isUser ? 'chat-bubble-primary' : 'chat-bubble-accent'}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <div className="card-actions justify-end mt-2">
          <div className="form-control w-full flex flex-row gap-2">
            <input
              type="text"
              placeholder="Ask about Crustdata APIs..."
              className="input input-bordered w-full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
