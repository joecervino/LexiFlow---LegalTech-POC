import React from 'react';
import { Sparkles, BrainCircuit, Search } from 'lucide-react';

export const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full max-w-2xl mx-auto text-center animate-fadeIn">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
        <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full border-2 border-blue-100 shadow-lg">
          <BrainCircuit className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-2">
        LexiFlow is thinking...
      </h3>
      <p className="text-slate-500 mb-8">
        Gemini Pro 3.0 is reading the document, analyzing clauses, and formulating a checklist.
      </p>

      <div className="w-full max-w-md space-y-3">
        <Step label="Performing High-Res OCR extraction" icon={Search} delay="0s" />
        <Step label="Identifying key legal risks & obligations" icon={Sparkles} delay="1s" />
        <Step label="Structuring action checklist" icon={BrainCircuit} delay="2s" />
      </div>
    </div>
  );
};

const Step: React.FC<{ label: string; icon: any; delay: string }> = ({ label, icon: Icon, delay }) => (
  <div 
    className="flex items-center p-3 bg-white border border-slate-100 rounded-lg shadow-sm animate-slideUp"
    style={{ animationDelay: delay, animationFillMode: 'both' }}
  >
    <Icon className="w-4 h-4 text-blue-500 mr-3" />
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <div className="ml-auto">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);