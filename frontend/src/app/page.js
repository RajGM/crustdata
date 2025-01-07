'use client';

import React, { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Display user's message immediately
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      // Send request to your Express server
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input })
      });
      const data = await response.json();

      // Add assistant's response
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      console.error(err);
      // Optionally handle error (e.g., show a system message)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Could not get a response.' }]);
    }

    setInput('');
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
              <div 
                key={idx} 
                className={`chat ${isUser ? 'chat-start' : 'chat-end'}`}
              >
                <div
                  className={`chat-bubble ${
                    isUser
                      ? 'chat-bubble-primary'
                      : 'chat-bubble-accent'
                  }`}
                >
                  {msg.content}
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
