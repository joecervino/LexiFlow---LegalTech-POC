import React, { useState } from 'react';
import { UploadWidget } from './components/UploadWidget';
import { ThinkingIndicator } from './components/ThinkingIndicator';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeLegalDocument, fileToGenerativePart } from './services/geminiService';
import { AppState } from './types';
import { Scale } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    status: 'idle',
    currentFile: null,
    imagePreview: null,
    analysis: null,
    error: null
  });

  const handleFileSelect = async (file: File) => {
    // Optimistic UI updates
    const preview = await fileToGenerativePart(file);
    
    setState({
      status: 'analyzing',
      currentFile: file,
      imagePreview: `data:${file.type};base64,${preview}`,
      analysis: null,
      error: null
    });

    try {
      const result = await analyzeLegalDocument(file);
      setState(prev => ({
        ...prev,
        status: 'complete',
        analysis: result
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        status: 'error',
        error: "Analysis failed. Please ensure your API key is valid and try again."
      }));
    }
  };

  const handleReset = () => {
    setState({
      status: 'idle',
      currentFile: null,
      imagePreview: null,
      analysis: null,
      error: null
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={handleReset}>
            <div className="bg-slate-900 p-2 rounded-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">LexiFlow</span>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-md border border-blue-100">
               Powered by Gemini 2.0
             </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {state.error && (
          <div className="max-w-2xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <span className="mr-2 font-bold">Error:</span> {state.error}
            <button onClick={handleReset} className="ml-auto text-sm underline">Try Again</button>
          </div>
        )}

        {state.status === 'idle' && (
          <div className="flex-grow flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-4 font-serif">
                Automated Legal Intelligence
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Upload contracts, agreements, or legal correspondence. 
                LexiFlow uses AI to extract text, identify risks, and generate actionable checklists instantly.
              </p>
            </div>
            <UploadWidget onFileSelect={handleFileSelect} isProcessing={false} />
          </div>
        )}

        {state.status === 'analyzing' && (
          <div className="flex-grow flex items-center justify-center p-8">
            <ThinkingIndicator />
          </div>
        )}

        {state.status === 'complete' && state.analysis && state.imagePreview && (
          <AnalysisDashboard 
            analysis={state.analysis} 
            imagePreview={state.imagePreview}
            onReset={handleReset}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} LexiFlow AI. Confidential & Secure Processing.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;