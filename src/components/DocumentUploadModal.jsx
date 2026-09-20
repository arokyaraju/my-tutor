import React, { useState, useCallback } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';
import { uploadCourseDocument } from '../services/api';

export default function DocumentUploadModal({
  isOpen,
  onClose,
  onCourseCreated
}) {
  if (!isOpen) return null;

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadState, setUploadState] = useState('idle'); // 'idle' | 'uploading' | 'parsing' | 'structuring' | 'complete' | 'error'
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const executeUploadAndStructuring = async () => {
    if (!selectedFile) return;

    setUploadState('uploading');
    setProgressMsg('Uploading document bytes to secure parsing sandbox...');
    setErrorMsg('');

    try {
      setTimeout(() => {
        setUploadState('parsing');
        setProgressMsg('Extracting text and tabular data (PDF / Mammoth / XLSX)...');
      }, 700);

      setTimeout(() => {
        setUploadState('structuring');
        setProgressMsg('Structuring curriculum into Basics, Advanced & Expert tiers with SSML & 1/2/5/10 markers...');
      }, 1600);

      const course = await uploadCourseDocument(selectedFile);

      setUploadState('complete');
      setProgressMsg('Curriculum generated successfully with full SSML whiteboard timeline!');

      setTimeout(() => {
        if (onCourseCreated) onCourseCreated(course);
        onClose();
      }, 1200);

    } catch (err) {
      console.error('Document upload error:', err);
      setUploadState('error');
      setErrorMsg(err.message || 'Failed to parse file. Please verify file format.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 90,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '580px',
        width: '100%',
        borderRadius: '16px',
        padding: '24px',
        position: 'relative'
      }}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UploadCloud size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Upload Custom Course Material
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Ingest PDF, Word (.docx), Excel (.xlsx), or Notepad (.txt) notes.
            </p>
          </div>
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragActive ? '#6366f1' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '12px',
            padding: '36px 20px',
            textAlign: 'center',
            background: dragActive ? 'rgba(99, 102, 241, 0.1)' : 'rgba(15, 23, 42, 0.5)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginBottom: '16px'
          }}
          onClick={() => document.getElementById('fileUploadInput').click()}
        >
          <input
            id="fileUploadInput"
            type="file"
            accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.txt,.md"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '10px' }}>
            <FileText size={28} color="#38bdf8" />
            <FileSpreadsheet size={28} color="#10b981" />
            <FileCode size={28} color="#f59e0b" />
          </div>

          <p style={{ fontSize: '0.94rem', fontWeight: 600, color: '#ffffff', marginBottom: '4px' }}>
            {selectedFile ? selectedFile.name : 'Click to browse or drag and drop your document'}
          </p>

          <p style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Supports PDF, Word (.docx), Excel (.xlsx), and Text/Markdown (.txt, .md) up to 30MB
          </p>
        </div>

        {/* Processing State Banner */}
        {uploadState !== 'idle' && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            background: uploadState === 'error' ? 'rgba(239, 68, 68, 0.15)' : uploadState === 'complete' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            border: `1px solid ${uploadState === 'error' ? 'rgba(239, 68, 68, 0.3)' : uploadState === 'complete' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            {uploadState === 'error' ? (
              <AlertCircle size={18} color="#ef4444" />
            ) : uploadState === 'complete' ? (
              <CheckCircle2 size={18} color="#10b981" />
            ) : (
              <Loader2 size={18} color="#6366f1" className="animate-spin" />
            )}

            <span style={{ fontSize: '0.84rem', color: uploadState === 'error' ? '#f87171' : uploadState === 'complete' ? '#34d399' : '#e2e8f0', fontWeight: 500 }}>
              {errorMsg || progressMsg}
            </span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={executeUploadAndStructuring}
          disabled={!selectedFile || (uploadState !== 'idle' && uploadState !== 'error')}
          className="btn btn-primary"
          style={{ width: '100%', padding: '12px', fontSize: '0.94rem' }}
        >
          <Sparkles size={16} />
          {uploadState === 'idle' || uploadState === 'error' ? 'Parse & Structure with AI Tutor' : 'Building 3-Tier Course...'}
        </button>

      </div>
    </div>
  );
}
