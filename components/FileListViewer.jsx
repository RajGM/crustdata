'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { listFilesInFirebase, uploadFileToFirebase, deleteFileInFirebase } from '@lib/firebaseUtil'; // Adjust the paths as needed
import { toast } from 'react-hot-toast';

export default function ListFileViewer() {
  const [files, setFiles] = useState([]);
  const [selectedContent, setSelectedContent] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [updatingFile, setUpdatingFile] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoadingFiles(true);
      try {
        const fetchedFiles = await listFilesInFirebase('uploads');
        setFiles(fetchedFiles);
      } catch (error) {
        console.error('Error listing files:', error);
      }
      setLoadingFiles(false);
    };

    fetchFiles();
  }, []);

  const handleFileSelect = async (fileUrl, fileName) => {
    setLoadingContent(true);
    try {
      const response = await fetch(fileUrl);
      const text = await response.text();
      setSelectedContent(text);
      setSelectedFileName(fileName);
      setEditorContent(text);
    } catch (error) {
      console.error('Error loading file:', error);
      setSelectedContent('Error loading file content.');
    }
    setLoadingContent(false);
  };

  const handleUpdateFile = async () => {
    if (!selectedFileName || !editorContent) {
      toast.error('No file selected or content is empty.');
      return;
    }
  
    setUpdatingFile(true);
  
    try {
      // Step 1: Deleting the existing file
      const deleteToast = toast.loading('Deleting existing file...');
      await deleteFileInFirebase(`uploads/${selectedFileName}`);
      toast.dismiss(deleteToast); // Remove the loading toast
      toast.success('Existing file deleted successfully.');
  
      // Step 2: Uploading the new file
      const uploadToast = toast.loading('Uploading new file...');
      const fileBlob = new Blob([editorContent], { type: 'text/markdown' });
      const newFileUrl = await uploadFileToFirebase(fileBlob, `uploads/${selectedFileName}`);
      toast.dismiss(uploadToast); // Remove the loading toast
      toast.success('New file uploaded successfully.');
  
      // Step 3: Processing the new file on the backend
      const processingToast = toast.loading('Processing new file on the backend...');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: selectedFileName,
          fileUrl: newFileUrl,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Backend responded with ${response.status}: ${errorData}`);
      }
  
      const result = await response.json();
      toast.dismiss(processingToast); // Remove the loading toast
      toast.success('Backend processing complete.');
      console.log('Backend response:', result);
    } catch (error) {
      console.error('Error updating file:', error);
      toast.dismiss(); // Dismiss any existing toast
      toast.error(`Failed to update file: ${error.message}`);
    } finally {
      setUpdatingFile(false);
    }
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Files in Firebase Storage</h2>

      {/* File List Section */}
      <div className="card bg-base-200 shadow-lg mb-8">
        <div className="card-body">
          <h3 className="text-xl font-semibold mb-4">Available Files</h3>
          {loadingFiles ? (
            <p>Loading files...</p>
          ) : (
            <ul className="menu bg-base-100 p-2 rounded-box">
              {files.map((file) => (
                <li key={file.name}>
                  <button
                    className="btn btn-link text-left w-full"
                    onClick={() => handleFileSelect(file.url, file.name)}
                  >
                    {file.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* File Content / Markdown Editor */}
      {loadingContent && (
        <div className="alert alert-info shadow-lg mb-4">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v16h16V4H4z"
              />
            </svg>
            <span>Loading file content...</span>
          </div>
        </div>
      )}

      {!loadingContent && selectedContent && (
        <div className="card bg-base-100 shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">{selectedFileName}</h3>
          <textarea
            className="textarea textarea-bordered w-full h-64 mb-4"
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
          />
          <div>
            <h4 className="text-lg font-semibold mb-2">Preview:</h4>
            <div className="prose max-w-none">
              <ReactMarkdown>{editorContent}</ReactMarkdown>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className={`btn btn-primary ${updatingFile ? 'btn-disabled' : ''}`}
              onClick={handleUpdateFile}
              disabled={updatingFile}
            >
              {updatingFile ? 'Updating...' : 'Update File'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
