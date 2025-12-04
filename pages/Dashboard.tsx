import React from 'react';
import { ToolType } from '../types';
import { BookOpen, Scale, Search, PenTool, FileText } from 'lucide-react';

interface DashboardProps {
  onNavigate: (tool: ToolType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const cards = [
    { id: ToolType.CASE_DIGEST, title: 'Case Digest', icon: <BookOpen className="text-blue-500" size={32} />, desc: 'Summarize jurisprudence instantly.' },
    { id: ToolType.MOCK_BAR, title: 'Mock Bar', icon: <Scale className="text-red-500" size={32} />, desc: 'Practice with AI-generated bar exams.' },
    { id: ToolType.CASE_BUILD, title: 'Case Build', icon: <Search className="text-purple-500" size={32} />, desc: 'Deep legal research and argumentation.' },
    { id: ToolType.CONTRACT_DRAFTING, title: 'Contracts', icon: <PenTool className="text-emerald-500" size={32} />, desc: 'Draft legal agreements in seconds.' },
    { id: ToolType.LAW_REVIEWER, title: 'Reviewer', icon: <FileText className="text-orange-500" size={32} />, desc: 'Create custom study materials.' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to LegalPH</h1>
        <p className="mt-2 text-gray-600">Your AI-powered legal assistant for research, drafting, and review.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all text-left"
          >
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{card.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Latest Legal Updates</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 flex-shrink-0" />
            <p className="text-gray-300 text-sm">Supreme Court issues new guidelines on the conduct of videoshift hearings.</p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 flex-shrink-0" />
            <p className="text-gray-300 text-sm">Updated 2025 Bar Examination Syllabus released.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
