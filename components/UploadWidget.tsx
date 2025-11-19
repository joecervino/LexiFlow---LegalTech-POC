import React, { useCallback } from 'react';
import { UploadCloud, FileType } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadWidget: React.FC<Props> = ({ onFileSelect, isProcessing }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      validateAndPass(files[0]);
    }
  }, [isProcessing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndPass(e.target.files[0]);
    }
  };

  const validateAndPass = (file: File) => {
    const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
    
    if (!isValidType) {
      alert('For this MVP, please upload an image (JPG, PNG) or a PDF document.');
      return;
    }
    onFileSelect(file);
  };

  return (
    <div 
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`
        w-full max-w-xl mx-auto mt-12 p-12 
        border-2 border-dashed rounded-xl text-center transition-all
        ${isProcessing 
          ? 'border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed' 
          : 'border-slate-300 bg-white hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
        }
      `}
    >
      <div className="flex flex-col items-center">
        <div className="p-4 bg-blue-100 rounded-full text-blue-600 mb-4">
          <UploadCloud className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          Upload Legal Document
        </h3>
        <p className="text-slate-500 mb-6 max-w-xs mx-auto">
          Drag and drop your contract scan, NDA, or agreement here (PDF, JPG, PNG).
        </p>
        
        <label className={`
          px-6 py-3 rounded-lg text-white font-medium transition-colors
          ${isProcessing ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}
        `}>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleChange}
            disabled={isProcessing}
          />
          {isProcessing ? 'Processing...' : 'Browse Files'}
        </label>
        
        <div className="mt-6 flex items-center space-x-2 text-xs text-slate-400">
          <FileType className="w-3 h-3" />
          <span>Supports High-Res Scans, Photos & PDFs</span>
        </div>
      </div>
    </div>
  );
};