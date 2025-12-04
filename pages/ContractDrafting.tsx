import React, { useState } from 'react';
import { generateContract } from '../services/geminiService';
import { ContractConfig, ToolType } from '../types';
import { PenTool, Loader2, Download, Save } from 'lucide-react';

interface ContractDraftingProps {
  onSaveToPad: (title: string, content: string, type: ToolType) => void;
}

export const ContractDrafting: React.FC<ContractDraftingProps> = ({ onSaveToPad }) => {
  const [config, setConfig] = useState<ContractConfig>({
    type: 'Lease',
    parties: '',
    terms: '',
    customClauses: ''
  });
  const [contract, setContract] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDraft = async () => {
    if (!config.parties || !config.terms) {
      alert("Please fill in Parties and Terms.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateContract(config);
      setContract(result);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (!contract) return;
    onSaveToPad(`${config.type} Agreement`, contract, ToolType.CONTRACT_DRAFTING);
    alert("Contract saved to Legal Pad.");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Configuration Panel */}
      <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <PenTool className="mr-2 text-emerald-600" />
          Contract Details
        </h2>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
            <select 
              className="w-full p-2.5 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500"
              value={config.type}
              onChange={(e) => setConfig({...config, type: e.target.value as any})}
            >
              <option>Lease</option>
              <option>Sale</option>
              <option>Employment</option>
              <option>Service</option>
              <option>Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Parties Involved</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 h-24 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Lessor: Juan Dela Cruz... Lessee: Maria Santos..."
              value={config.parties}
              onChange={(e) => setConfig({...config, parties: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Terms & Payment</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 h-24 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. Monthly rent of 10k, 1 year duration..."
              value={config.terms}
              onChange={(e) => setConfig({...config, terms: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Clauses (Optional)</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-300 h-24 text-sm focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g. No pets allowed, Force Majeure..."
              value={config.customClauses}
              onChange={(e) => setConfig({...config, customClauses: e.target.value})}
            />
          </div>
        </div>

        <button
          onClick={handleDraft}
          disabled={isLoading}
          className="w-full mt-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg flex items-center justify-center transition-colors"
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isLoading ? 'Drafting...' : 'Draft Contract'}
        </button>
      </div>

      {/* Preview Panel */}
      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <h3 className="font-semibold text-gray-700">Document Preview</h3>
          <div className="flex space-x-2">
             <button 
              onClick={handleSave}
              className="flex items-center px-3 py-1.5 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
            >
              <Save size={16} className="mr-1.5" /> Save
            </button>
            <button className="flex items-center px-3 py-1.5 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700">
              <Download size={16} className="mr-1.5" /> Export PDF
            </button>
          </div>
        </div>
        <div className="flex-1 p-8 bg-white overflow-y-auto legal-scroll rounded-b-xl">
          {contract ? (
            <div className="max-w-3xl mx-auto shadow-sm border p-12 bg-white min-h-[800px]">
               <pre className="whitespace-pre-wrap font-serif text-sm leading-relaxed text-gray-900">
                {contract}
               </pre>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              Generated contract will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
