
import React, { useEffect } from "react";
import { NAV_ITEMS } from "../constants/nav-items";
import { ToolType } from "../types/tool-type";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  currentTool,
  onNavigate,
}: MobileSidebarProps) {
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
        document.body.style.overflow = "";
    };
  }, [isOpen]);

  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.id === ToolType.ADMIN_PANEL) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <div
      className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
        isOpen ? "visible" : "invisible pointer-events-none"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <div
        className={`absolute top-0 left-0 h-full w-72 bg-gray-900 p-4 text-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-label="Mobile Navigation Menu"
      >
        <div className="flex items-center justify-between mb-8 px-2">
            <h1 className="text-xl font-bold flex items-center space-x-2">
                <span className="text-yellow-500">⚖️</span>
                <span>LegalPH</span>
            </h1>
            <button
            aria-label="Close mobile navigation menu"
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            >
            <X size={24} />
            </button>
        </div>

        <nav className="flex flex-col gap-2">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTool === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onClose();
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left transition-all duration-200 ${
                isActive
                  ? "bg-yellow-500 text-black shadow-md ring-2 ring-yellow-400 font-semibold"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
        </nav>
      </div>
    </div>
  );
}
