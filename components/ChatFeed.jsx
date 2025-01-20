// components/ChatFeed.jsx
'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatFeed() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'assistant', content: '...' }]);

    try {
      const payload = {
        query: input,
        history: messages,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [...updated, { role: 'assistant', content: data.answer }];
      });
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = prev.slice(0, -1);
        return [...updated, { role: 'assistant', content: 'Error: Could not get a response.' }];
      });
    } finally {
      setIsLoading(false);
      console.log(messages);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col flex-1 max-w-2xl bg-base-100 shadow-xl m-4 p-4">
      {/* Header / Navbar */}
      <nav className="navbar mb-4">
        <div className="flex-1 px-2">
          <a className="text-xl font-bold text-primary">Crustdata Support Chat</a>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex flex-col flex-grow">
        <div className="overflow-y-auto flex-1 space-y-4 mb-4">
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
        <div className="flex flex-row gap-2">
          <input
            type="text"
            placeholder="Ask about Crustdata APIs..."
            className="input input-bordered flex-grow"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
          />
          <button className="btn btn-primary" onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}