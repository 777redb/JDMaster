
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CaseDigest } from './pages/CaseDigest';
import { MockBar } from './pages/MockBar';
import { CaseBuild } from './pages/CaseBuild';
import { LawReviewer } from './pages/LawReviewer';
import { ContractDrafting } from './pages/ContractDrafting';
import { LegalPad } from './pages/LegalPad';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToolType, LegalDocument } from './types';

// Wrapper component to handle View Routing based on state
const MainApp = () => {
  const { user } = useAuth();
  const [currentTool, setCurrentTool] = useState<ToolType>(ToolType.DASHBOARD);
  const [documents, setDocuments] = useState<LegalDocument[]>(() => {
    const saved = localStorage.getItem('legalph_documents');
    return saved ? JSON.parse(saved) : [];
  });

  // Simple Hash Routing for Login
  const [isLoginPage, setIsLoginPage] = useState(false);

  useEffect(() => {
    const checkHash = () => setIsLoginPage(window.location.hash === '#login');
    window.addEventListener('hashchange', checkHash);
    checkHash(); // Initial check
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  useEffect(() => {
    if (!user && !isLoginPage) {
        // Redirect logic if using real router, here we just force login view
        // In a real app, this would be handled by <Route>
    }
  }, [user, isLoginPage]);

  useEffect(() => {
    localStorage.setItem('legalph_documents', JSON.stringify(documents));
  }, [documents]);

  const handleNavigate = (tool: ToolType) => {
    setCurrentTool(tool);
  };

  const handleSaveToPad = (title: string, content: string, type: ToolType) => {
    const newDoc: LegalDocument = {
      id: Date.now().toString(),
      title,
      content,
      type,
      createdAt: Date.now(),
      tags: []
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const handleDeleteDoc = (id: string) => {
    if(window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== id));
    }
  };

  const renderContent = () => {
    switch (currentTool) {
      case ToolType.DASHBOARD:
        return <Dashboard onNavigate={handleNavigate} />;
      case ToolType.CASE_DIGEST:
        return <CaseDigest onSaveToPad={handleSaveToPad} />;
      case ToolType.MOCK_BAR:
        return <MockBar onSaveToPad={handleSaveToPad} />;
      case ToolType.CASE_BUILD:
        return <CaseBuild onSaveToPad={handleSaveToPad} />;
      case ToolType.LAW_REVIEWER:
        return <LawReviewer onSaveToPad={handleSaveToPad} />;
      case ToolType.CONTRACT_DRAFTING:
        return <ContractDrafting onSaveToPad={handleSaveToPad} />;
      case ToolType.LEGAL_PAD:
        return <LegalPad documents={documents} onDelete={handleDeleteDoc} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  if (!user || isLoginPage) {
    return <Login />;
  }

  return (
    <ProtectedRoute>
      <Layout currentTool={currentTool} onNavigate={handleNavigate}>
        {renderContent()}
      </Layout>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
