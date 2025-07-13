import React, { useState } from 'react';
import axios from 'axios';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.js';

pdfjsLib.GlobalWorkerOptions.workerSrc = window.URL.createObjectURL(
  new Blob(
    [`importScripts("${require('pdfjs-dist/build/pdf.worker.entry')}");`],
    { type: 'application/javascript' }
  )
);

export default function UploadPDF({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const typedArray = new Uint8Array(reader.result);
          const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

          let fullText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
          }

          resolve(fullText);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (err) => reject(err);
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post("http://localhost:8000/upload/", formData);
      const text = await extractTextFromPDF(file);

      onUploadSuccess({ filename: res.data.filename, text });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ PDF upload or extraction failed. Try again.");
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <div className="upload-box">
      <input
        className="upload-input"
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        className="upload-button"
        onClick={handleUpload}
        disabled={!file || isExtracting}
      >
        {isExtracting ? "Extracting..." : "Upload PDF"}
      </button>
    </div>
  );
}
