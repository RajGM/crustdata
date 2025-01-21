'use client';

import React, { useState } from 'react';
import { uploadFileToFirebase } from '@lib/firebaseUtil';
import { toast } from 'react-hot-toast';

export default function FileUploader({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Track upload process

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const allowedExtensions = /\.md$/i; // Matches files with a .md extension

      if (!allowedExtensions.test(selectedFile.name)) {
        toast.error('Only Markdown (.md) files are allowed.');
        setFile(null); // Clear any previously selected file
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const uploadToast = toast.loading('Uploading file...'); // Initial loading toast

    try {
      setIsUploading(true);

      // Upload to Firebase
      const downloadURL = await uploadFileToFirebase(file);
      toast.success('File uploaded to Firebase!', { id: uploadToast });

      // Notify user that backend processing is starting
      const processingToast = toast.loading('Processing file on the backend...');

      // Send URL to backend
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

      // Replace the processing toast with a success message
      toast.success('File processed successfully by the backend!', { id: processingToast });

      if (onFileUpload) {
        onFileUpload(file.name, downloadURL);
      }
    } catch (error) {
      console.error(error);

      // Replace any existing toast with an error message
      toast.error(`Upload failed: ${error.message}`, { id: uploadToast });
    } finally {
      setIsUploading(false);
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
          <button
            onClick={handleUpload}
            className={`btn btn-primary ${isUploading ? 'btn-disabled' : ''}`}
            disabled={!file || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      </div>
    </div>
  );
}
