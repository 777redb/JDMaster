import React, { useState } from 'react';
import { generateMockBarQuestion } from '../services/geminiService';
import { MockBarConfig, ToolType } from '../types';
import { Loader2, HelpCircle, CheckCircle, Save } from 'lucide-react';

interface MockBarProps {
  onSaveToPad: (title: string, content: string, type: ToolType) => void;
}

export const MockBar: React.FC<MockBarProps> = ({ onSaveToPad }) => {
  const [config, setConfig] = useState<MockBarConfig>({
    difficulty: 'Moderate',
    subject: 'Remedial Law',
    type: 'Issue-Spotting'
  });
  const [question, setQuestion] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const subjects = [
    'Political Law', 'Labor Law', 'Civil Law', 'Taxation Law', 
    'Mercantile Law', 'Criminal Law', 'Remedial Law', 'Legal Ethics'
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setShowAnswer(false);
    setUserAnswer('');
    try {
      const result = await generateMockBarQuestion(config);
      setQuestion(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!question) return;
    const content = `QUESTION:\n\n${question}\n\nUSER ANSWER:\n\n${userAnswer}`;
    onSaveToPad(`Mock Bar - ${config.subject}`, content, ToolType.MOCK_BAR);
    alert("Saved simulation to Legal Pad.");
  };

  // Split question from answer if the AI combined them (Prompt requests model answer at the end)
  // Simple heuristic split for display purposes if the AI follows instructions
  const parts = question.split('MODEL ANSWER');
  const questionText = parts[0] || '';
  const modelAnswerText = parts.length > 1 ? 'MODEL ANSWER' + parts.slice(1).join('MODEL ANSWER') : '';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-gray-300"
              value={config.subject}
              onChange={(e) => setConfig({...config, subject: e.target.value})}
            >
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-gray-300"
              value={config.difficulty}
              onChange={(e) => setConfig({...config, difficulty: e.target.value as any})}
            >
              <option>Easy</option>
              <option>Moderate</option>
              <option>Difficult</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-gray-300"
              value={config.type}
              onChange={(e) => setConfig({...config, type: e.target.value as any})}
            >
              <option>Issue-Spotting</option>
              <option>Essay</option>
              <option>Situational</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : <HelpCircle className="mr-2" size={20} />}
          {isLoading ? 'Simulating Exam...' : 'Generate Question'}
        </button>
      </div>

      {question && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Question</h3>
            <div className="prose prose-lg text-gray-800 whitespace-pre-wrap font-serif">
              {questionText}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Answer</h3>
            <textarea
              className="w-full h-48 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none mb-4 font-mono text-sm"
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                {showAnswer ? 'Hide Model Answer' : 'Show Model Answer'}
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors flex items-center"
              >
                <Save className="mr-2" size={18} />
                Save Session
              </button>
            </div>
          </div>

          {showAnswer && modelAnswerText && (
            <div className="bg-green-50 p-8 rounded-xl shadow-sm border border-green-200">
              <div className="flex items-center space-x-2 mb-4 text-green-800 border-b border-green-200 pb-2">
                <CheckCircle size={24} />
                <h3 className="text-xl font-bold">Model Answer</h3>
              </div>
              <div className="prose prose-lg text-gray-800 whitespace-pre-wrap font-serif">
                {modelAnswerText}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
