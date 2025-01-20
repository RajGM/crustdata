'use client';

import React, { useState } from 'react';
import RightSidebar from '@components/RightSidebar';
import ChatFeed from '@components/ChatFeed';
import UploadSection from '@components/FileUploadSidebar';
import UpdateSection from '@components/FileListViewer';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat'); // Maintain active tab state here

  return (
    <main className="min-h-screen bg-base-200" data-theme="corporate">
      <div className="flex justify-center items-start py-4">
        <div className="flex flex-row w-full max-w-6xl">
          {/* Left Column: Content based on Active Tab */}
          <div className="flex-1">
            {activeTab === 'chat' && (
              <div>
                {/* Replace this with the actual ChatFeed component */}
                <ChatFeed/>
              </div>
            )}
            {activeTab === 'upload' && (
              <div>
                <UploadSection/>
              </div>
            )}
            {activeTab === 'update' && (
              <div>
                <UpdateSection/>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <RightSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </main>
  );
}
