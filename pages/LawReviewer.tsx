import React, { useState } from 'react';
import { generateLawReviewer } from '../services/geminiService';
import { ToolType } from '../types';
import { FileText, Loader2, Save } from 'lucide-react';

interface LawReviewerProps {
  onSaveToPad: (title: string, content: string, type: ToolType) => void;
}

export const LawReviewer: React.FC<LawReviewerProps> = ({ onSaveToPad }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateLawReviewer(topic);
      setContent(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!content) return;
    onSaveToPad(`Reviewer: ${topic}`, content, ToolType.LAW_REVIEWER);
    alert('Reviewer saved to Legal Pad.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold mb-2 flex items-center">
          <FileText className="mr-3" />
          Smart Reviewer Generator
        </h2>
        <p className="text-orange-100 mb-6">Generate high-yield notes, memory aids, and outlines for any legal topic.</p>
        
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-3 rounded-lg text-gray-900 outline-none"
            placeholder="Enter topic (e.g. Requisites of Valid Marriage, Justifying Circumstances)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic}
            className="px-8 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : 'Generate'}
          </button>
        </div>
      </div>

      {content && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 relative">
           <button 
              onClick={handleSave}
              className="absolute top-6 right-6 flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-md transition-colors"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          <div className="prose prose-orange max-w-none">
             <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>').replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^- (.*$)/gim, '<li>$1</li>') }} />
          </div>
        </div>
      )}
    </div>
  );
};
