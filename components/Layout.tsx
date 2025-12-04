
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import { ToolType } from "../types/tool-type";

interface LayoutProps {
  children: React.ReactNode;
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTool, onNavigate }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Desktop Sidebar */}
      <Sidebar currentTool={currentTool} onNavigate={onNavigate} />

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentTool={currentTool}
        onNavigate={onNavigate}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (mobile only) */}
        <Header 
            onOpenMobileMenu={() => setMobileMenuOpen(true)} 
            currentTool={currentTool}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
