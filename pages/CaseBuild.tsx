import React, { useState } from 'react';
import { generateCaseBuild } from '../services/geminiService';
import { Search, Loader2, Book, ArrowRight, Save } from 'lucide-react';
import { ToolType } from '../types';

interface CaseBuildProps {
  onSaveToPad: (title: string, content: string, type: ToolType) => void;
}

export const CaseBuild: React.FC<CaseBuildProps> = ({ onSaveToPad }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    try {
      const research = await generateCaseBuild(query);
      setResult(research);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    onSaveToPad(`Research: ${query.substring(0, 30)}...`, result, ToolType.CASE_BUILD);
    alert('Research saved to Legal Pad.');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Search className="mr-2 text-purple-600" />
          CaseBuild Research Engine
        </h2>
        <div className="relative">
          <input
            type="text"
            className="w-full p-4 pr-32 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none text-lg"
            placeholder="e.g. Is a holographic will valid without a date?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleResearch()}
          />
          <button
            onClick={handleResearch}
            disabled={isLoading || !query}
            className="absolute right-2 top-2 bottom-2 px-6 bg-purple-700 hover:bg-purple-800 text-white font-medium rounded-md transition-colors disabled:bg-gray-300"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div className="flex items-center space-x-2 text-gray-700">
            <Book size={18} />
            <span className="font-semibold">Research Results</span>
          </div>
          {result && (
            <button 
              onClick={handleSave}
              className="text-sm flex items-center space-x-1 text-purple-700 hover:text-purple-900"
            >
              <Save size={16} />
              <span>Save to Pad</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto legal-scroll">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Loader2 className="animate-spin text-purple-500" size={48} />
              <p>Analyzing Jurisprudence & Codal Provisions...</p>
            </div>
          ) : result ? (
            <div className="prose prose-slate max-w-none">
              <div dangerouslySetInnerHTML={{ __html: result.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Enter a legal question to begin research.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
