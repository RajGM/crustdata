'use client';

import React from 'react';

export default function RightSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="flex flex-col h-screen bg-base-100 shadow-lg w-1/4 border-l border-base-300">
      <nav className="flex flex-col py-4 space-y-4 px-2">
        <button
          className={`btn btn-block btn-outline ${activeTab === 'chat' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`btn btn-block btn-outline ${activeTab === 'upload' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload
        </button>
        <button
          className={`btn btn-block btn-outline ${activeTab === 'update' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('update')}
        >
          Update
        </button>
      </nav>
    </div>
  );
}
