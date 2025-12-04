import React, { useState } from 'react';
import { generateCaseDigest } from '../services/geminiService';
import { Save, Loader2, Copy, FileText } from 'lucide-react';
import { ToolType } from '../types';

interface CaseDigestProps {
  onSaveToPad: (title: string, content: string, type: ToolType) => void;
}

export const CaseDigest: React.FC<CaseDigestProps> = ({ onSaveToPad }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [caseTitle, setCaseTitle] = useState('');

  const handleGenerate = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const digest = await generateCaseDigest(inputText);
      setResult(digest);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (result && caseTitle) {
      onSaveToPad(caseTitle, result, ToolType.CASE_DIGEST);
      alert('Saved to Legal Pad!');
    } else {
      alert('Please provide a Case Title and generate a digest first.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
      {/* Input Section */}
      <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="mr-2 text-blue-600" size={20} />
          Input Case Text
        </h2>
        
        <input 
          type="text" 
          placeholder="Enter Case Title (e.g., Chi Ming Tsoi vs. CA)" 
          className="w-full p-3 mb-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
          value={caseTitle}
          onChange={(e) => setCaseTitle(e.target.value)}
        />

        <textarea
          className="flex-1 w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4 font-mono text-sm"
          placeholder="Paste the full text or main body of the jurisprudence here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        <button
          onClick={handleGenerate}
          disabled={isLoading || !inputText}
          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-400"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isLoading ? 'Digesting Case...' : 'Generate Digest'}
        </button>
      </div>

      {/* Output Section */}
      <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Generated Digest</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => navigator.clipboard.writeText(result)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-md"
              title="Copy to Clipboard"
            >
              <Copy size={18} />
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-gray-50 rounded-lg p-6 overflow-y-auto legal-scroll border border-gray-200">
          {result ? (
            <div className="prose prose-sm max-w-none text-gray-800 whitespace-pre-wrap">
              {result}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Generated digest will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
