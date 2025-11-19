import React, { useState } from 'react';
import { DocumentAnalysis, ChecklistItem, RiskLevel } from '../types';
import { 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  List, 
  Printer, 
  ChevronDown,
  Activity,
  Scale,
  Calendar,
  Users
} from 'lucide-react';

interface Props {
  analysis: DocumentAnalysis;
  imagePreview: string;
  onReset: () => void;
}

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors = {
    [RiskLevel.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
    [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [RiskLevel.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
    [RiskLevel.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colors[level as RiskLevel] || colors.LOW}`}>
      {level}
    </span>
  );
};

export const AnalysisDashboard: React.FC<Props> = ({ analysis, imagePreview, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'risks' | 'checklist' | 'ocr'>('overview');
  const [checklist, setChecklist] = useState<ChecklistItem[]>(analysis.checklist);

  const toggleCheckItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  const isPdf = imagePreview.startsWith('data:application/pdf');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header / Action Bar */}
      <div className="flex justify-between items-center mb-8 no-print">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{analysis.documentType} Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">Processed by Gemini 3.0 Pro</p>
        </div>
        <div className="flex space-x-3">
           <button 
            onClick={onReset}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Upload New
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 mr-2" />
            Export Report (PDF)
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Document Preview (Hidden on Print) */}
        <div className="w-full lg:w-1/3 no-print">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="p-4 bg-slate-50 border-b border-slate-200 font-medium text-slate-700 flex justify-between items-center">
              <span>Source Document</span>
              <span className="text-xs bg-slate-200 px-2 py-1 rounded">{isPdf ? 'PDF' : 'Image'}</span>
            </div>
            <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
              {isPdf ? (
                <iframe 
                  src={imagePreview} 
                  title="PDF Preview"
                  className="w-full h-full"
                />
              ) : (
                <img 
                  src={imagePreview} 
                  alt="Source" 
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Intelligence Dashboard */}
        <div className="w-full lg:w-2/3">
          
          {/* Navigation Tabs (No Print) */}
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6 no-print">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'risks', label: 'Risk Analysis', icon: AlertTriangle },
              { id: 'checklist', label: 'Action Plan', icon: CheckCircle },
              { id: 'ocr', label: 'Extracted Text', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[600px] no-print">
            
            {/* OVERVIEW TAB */}
            {(activeTab === 'overview') && (
              <div className="space-y-6 animate-fadeIn">
                <section>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Executive Summary</h3>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {analysis.summary}
                  </p>
                </section>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Parties Involved</h4>
                    <ul className="space-y-1">
                      {analysis.partiesInvolved.map((party, i) => (
                        <li key={i} className="text-sm font-medium text-slate-900 flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                          {party}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Execution Details</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-500">Date</span>
                      <span className="text-sm font-medium text-slate-900">{analysis.executionDate || 'Not Detected'}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-sm text-slate-500">Risk Factor</span>
                      <RiskBadge level={analysis.risks.some(r => r.severity === 'CRITICAL' || r.severity === 'HIGH') ? 'HIGH' : 'LOW'} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* RISKS TAB */}
            {(activeTab === 'risks') && (
              <div className="space-y-4 animate-fadeIn">
                {analysis.risks.map((risk, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{risk.issue}</h4>
                      <RiskBadge level={risk.severity} />
                    </div>
                    <div className="bg-slate-50 p-2 rounded text-sm font-mono text-slate-600 mb-3 border border-slate-100">
                      "{risk.clause}"
                    </div>
                    <p className="text-sm text-slate-700">
                      <strong className="font-medium text-slate-900">Recommendation:</strong> {risk.recommendation}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* CHECKLIST TAB */}
            {(activeTab === 'checklist') && (
              <div className="space-y-2 animate-fadeIn">
                {checklist.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleCheckItem(item.id)}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                      item.isCompleted 
                        ? 'bg-slate-50 border-slate-200 opacity-75' 
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center mr-4 transition-colors ${
                      item.isCompleted ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'
                    }`}>
                      {item.isCompleted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className={`font-medium ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          {item.action}
                        </h4>
                        <span className="text-xs font-medium text-slate-400 uppercase">{item.role}</span>
                      </div>
                      <p className={`text-sm ${item.isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

             {/* OCR TAB */}
             {(activeTab === 'ocr') && (
              <div className="animate-fadeIn h-[600px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200 font-serif text-slate-800 leading-relaxed whitespace-pre-wrap">
                {analysis.extractedText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------------
          PRINT VIEW LAYOUT 
          This section is hidden on screen but displays when printing / exporting PDF
      ------------------------------------------------------------------------- */}
      <div className="print-only bg-white max-w-[210mm] mx-auto">
        
        {/* Report Header */}
        <div className="flex justify-between items-end border-b-4 border-slate-900 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <Scale className="w-8 h-8 text-slate-900" />
               <h1 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">LexiFlow</h1>
            </div>
            <p className="text-slate-500 uppercase tracking-widest text-xs font-bold pl-1">Automated Legal Intelligence</p>
          </div>
          <div className="text-right">
            <div className="inline-block bg-slate-100 px-3 py-1 rounded mb-2">
              <h2 className="text-lg font-bold text-slate-900">{analysis.documentType}</h2>
            </div>
            <p className="text-slate-500 text-sm flex items-center justify-end">
              <Calendar className="w-3 h-3 mr-1"/> {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Executive Summary */}
        <section className="mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200 break-inside-avoid">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Executive Summary
          </h3>
          <p className="text-slate-800 leading-relaxed text-justify font-serif text-sm">
            {analysis.summary}
          </p>
          
          <div className="grid grid-cols-2 gap-6 mt-6 pt-6 border-t border-slate-200">
             <div>
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center mb-2">
                  <Users className="w-3 h-3 mr-1"/> Parties Involved
                </span>
                <ul className="space-y-1">
                    {analysis.partiesInvolved.map((p,i) => <li key={i} className="font-medium text-sm text-slate-900">• {p}</li>)}
                </ul>
             </div>
             <div>
                <span className="text-xs font-bold text-slate-400 uppercase flex items-center mb-2">
                  <Calendar className="w-3 h-3 mr-1"/> Execution Details
                </span>
                <p className="font-medium text-sm text-slate-900">Date: {analysis.executionDate || 'Not Detected'}</p>
             </div>
          </div>
        </section>

        {/* Risk Matrix */}
        <section className="mb-8">
           <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center border-b border-slate-200 pb-2">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
            Risk Analysis
          </h3>
          <div className="space-y-4">
            {analysis.risks.map((risk, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-4 break-inside-avoid bg-white">
                <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-slate-900 text-sm">{risk.issue}</span>
                    <span className={`px-3 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${
                        risk.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border-red-200' :
                        risk.severity === 'HIGH' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                        'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                        {risk.severity}
                    </span>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100 mb-2">
                  <p className="text-xs text-slate-600 italic font-serif">"{risk.clause}"</p>
                </div>
                <p className="text-sm font-medium text-slate-900"><span className="text-slate-500 font-normal">Recommendation:</span> {risk.recommendation}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="page-break"></div>

        {/* Action Checklist */}
        <section className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center mb-4 border-b border-slate-200 pb-2">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Action Checklist
          </h3>
          
          <div className="border border-slate-200 rounded-lg overflow-hidden">
             {checklist.map((item, index) => (
               <div key={item.id} className={`p-4 flex items-start bg-white break-inside-avoid ${index !== checklist.length - 1 ? 'border-b border-slate-100' : ''}`}>
                 <div className="w-5 h-5 border-2 border-slate-300 rounded mr-4 mt-0.5 flex-shrink-0 bg-white"></div>
                 <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{item.action}</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase font-bold">{item.role}</span>
                    </div>
                    <p className="text-sm text-slate-600">{item.description}</p>
                 </div>
               </div>
             ))}
          </div>
        </section>

        {/* Extracted Text Snippet */}
        <section className="mb-8">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Text Sample</h3>
          <div className="text-[10px] font-serif text-slate-400 leading-tight text-justify h-32 overflow-hidden relative">
            {analysis.extractedText}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        </section>
        
        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="p-4 bg-slate-50 rounded text-[10px] text-slate-500 text-justify leading-relaxed mb-4">
              <strong>Disclaimer:</strong> This document is generated by an artificial intelligence system (LexiFlow) and is intended for informational purposes only. 
              It does not constitute legal advice, attorney-client privilege, or professional legal opinion. 
              Please consult a qualified attorney for verification of all findings, risks, and recommendations.
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 uppercase tracking-widest">
              <span>LexiFlow AI System 2.0</span>
              <span>Confidential & Privileged</span>
          </div>
        </div>
      </div>
    </div>
  );
};