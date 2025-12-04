
import React, { useState } from 'react';
import { LegalDocument, ToolType } from '../types';
import { Folder, FileText, Trash2, Search, Tag, Eye, X } from 'lucide-react';

interface LegalPadProps {
  documents: LegalDocument[];
  onDelete: (id: string) => void;
}

export const LegalPad: React.FC<LegalPadProps> = ({ documents, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null);

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: ToolType) => {
    switch(type) {
      case ToolType.CASE_DIGEST: return 'bg-blue-100 text-blue-800';
      case ToolType.MOCK_BAR: return 'bg-red-100 text-red-800';
      case ToolType.CONTRACT_DRAFTING: return 'bg-emerald-100 text-emerald-800';
      case ToolType.CASE_BUILD: return 'bg-purple-100 text-purple-800';
      case ToolType.LAW_REVIEWER: return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTypeLabel = (type: string) => {
    // Replaces dashes or underscores with spaces and capitalizes
    return type.replace(/[-_]/g, ' ').toUpperCase();
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
      {/* List View */}
      <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${selectedDoc ? 'hidden md:flex md:w-1/3' : 'w-full'}`}>
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
            <Folder className="mr-2 text-yellow-500" />
            My Documents
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Search files..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredDocs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No documents found. Save generated content from other tools to see them here.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filteredDocs.map(doc => (
                <li 
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900 truncate pr-2">{doc.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getTypeColor(doc.type)}`}>
                      {formatTypeLabel(doc.type)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Detail View */}
      {selectedDoc && (
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{selectedDoc.title}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-md ${getTypeColor(selectedDoc.type)}`}>
                  {formatTypeLabel(selectedDoc.type)}
                </span>
                <span className="text-xs text-gray-500">
                  Created: {new Date(selectedDoc.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setSelectedDoc(null)}
              className="md:hidden p-2 text-gray-500"
            >
              <X />
            </button>
          </div>
          
          <div className="flex-1 p-8 overflow-y-auto legal-scroll">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
              {selectedDoc.content}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
