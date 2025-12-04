
import React from 'react';
import { Menu } from "lucide-react";
import { ToolType } from "../types/tool-type";
import { NAV_ITEMS } from "../constants/nav-items";

interface HeaderProps {
  onOpenMobileMenu: () => void;
  currentTool: ToolType;
}

export default function Header({ onOpenMobileMenu, currentTool }: HeaderProps) {
  const currentItem = NAV_ITEMS.find(i => i.id === currentTool);

  return (
    <header className="lg:hidden flex items-center justify-between bg-white text-gray-900 p-4 border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
            aria-label="Open navigation menu"
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
            <Menu size={24} />
        </button>
        <h2 className="text-lg font-bold truncate">
            {currentItem?.label || 'LegalPH'}
        </h2>
      </div>
      <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-xs font-bold text-black">
         AT
      </div>
    </header>
  );
}
