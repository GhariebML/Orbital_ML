import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { apiClient } from '../../../lib/apiClient';

interface UploadDropzoneProps {
  onUploadSuccess?: (projectId: number, projectData: any) => void;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({ onUploadSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileStatus, setFileStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setErrorMsg('Only CSV and Excel files are supported.');
      setFileStatus('error');
      return;
    }

    setFileStatus('uploading');
    setErrorMsg('');
    setUploadedFileName(file.name);

    try {
      // 1. Create a new project dynamically
      const projectName = file.name.split('.')[0] || 'New Project';
      const projRes = await apiClient.post('/projects/', { name: projectName });
      const projectId = projRes.data.id;

      // 2. Upload the file
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadRes = await apiClient.post(`/projects/${projectId}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setFileStatus('success');
      if (onUploadSuccess) onUploadSuccess(projectId, uploadRes.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'An error occurred during upload.');
      setFileStatus('error');
    }
  };

  return (
    <Card 
      className={clsx(
        "mt-8 border-dashed transition-all duration-300",
        isDragging ? "border-[#6366F1] bg-[#6366F1]/5" : "border-[#1f2937] bg-[#0b1020]/50",
        fileStatus === 'success' && "border-[#22C55E]/50 bg-[#22C55E]/5",
        fileStatus === 'error' && "border-[#EF4444]/50 bg-[#EF4444]/5"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        {(fileStatus === 'idle' || fileStatus === 'uploading' || fileStatus === 'error') ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center"
          >
            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-[#6366F1]/20' : 'bg-[#1f2937]'}`}>
              {fileStatus === 'error' ? (
                <AlertTriangle className="h-8 w-8 text-[#EF4444]" />
              ) : (
                <UploadCloud className={`h-8 w-8 ${isDragging ? 'text-[#6366F1]' : 'text-[#9CA3AF]'}`} />
              )}
            </div>
            <h3 className="text-xl font-semibold text-[#F9FAFB] mb-2">Upload your Dataset</h3>
            <p className="text-[#9CA3AF] mb-6 max-w-sm">
              {fileStatus === 'error' 
                ? <span className="text-[#EF4444]">{errorMsg}</span>
                : "Drag and drop your CSV or Excel file here, or click to browse. The AutoML engine will automatically run EDA."
              }
            </p>
            
            <div className="relative">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                onChange={handleFileSelect} 
                accept=".csv,.xlsx"
                disabled={fileStatus === 'uploading'}
              />
              <button 
                className={clsx(
                  "px-4 py-2 rounded-lg font-medium text-sm transition-colors",
                  fileStatus === 'uploading' 
                    ? "bg-[#374151] text-[#9CA3AF] cursor-not-allowed" 
                    : "bg-[#1f2937] text-white hover:bg-[#374151]"
                )}
              >
                {fileStatus === 'uploading' ? 'Analyzing Dataset...' : 'Browse Files'}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="flex flex-col items-center py-6"
          >
            <CheckCircle2 className="h-12 w-12 text-[#22C55E] mb-4" />
            <h3 className="text-xl font-semibold text-[#F9FAFB] mb-1">Dataset Analyzed Successfully</h3>
            <div className="flex items-center gap-2 text-[#9CA3AF] bg-[#1f2937]/50 px-3 py-1.5 rounded-md mt-4">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{uploadedFileName}</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
