'use client';

import React, { useState } from 'react';
import { uploadFileToFirebase } from '@lib/firebaseUtil';

export default function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedExtensions = /\.md$/i; // Matches files with a .md extension

      if (!allowedExtensions.test(selectedFile.name)) {
        setUploadStatus('Only Markdown (.md) files are allowed.');
        setFile(null); // Clear any previously selected file
        return;
      }

      setFile(selectedFile);
      setUploadStatus('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadStatus('Uploading to Firebase...');
      const downloadURL = await uploadFileToFirebase(file);
      setUploadStatus('File uploaded to Firebase. Sending URL to backend...');

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${backendUrl}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          fileUrl: downloadURL,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Backend responded with ${response.status}: ${errorData}`);
      }

      const result = await response.json();
      setUploadStatus(`Upload successful! File URL: ${downloadURL}`);
      console.log('Server response:', result);

      if (onFileUpload) {
        onFileUpload(file.name, downloadURL);
      }
    } catch (error) {
      console.error(error);
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  };

  return (
    <div className="card w-full bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4">Upload Files</h2>
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Select a Markdown file to upload:</span>
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered w-full"
        />
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="flex justify-center w-full">
          <button onClick={handleUpload} className="btn btn-primary" disabled={!file}>
            Upload File
          </button>
        </div>
        {uploadStatus && <p className="text-sm text-center">{uploadStatus}</p>}
      </div>
    </div>
  );
}
