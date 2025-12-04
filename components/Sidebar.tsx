
import React from 'react';
import { NAV_ITEMS } from "../constants/nav-items";
import { ToolType } from "../types/tool-type";
import { useAuth } from "../context/AuthContext";

interface SidebarProps {
  currentTool: ToolType;
  onNavigate: (tool: ToolType) => void;
}

export default function Sidebar({ currentTool, onNavigate }: SidebarProps) {
  const { user } = useAuth();

  // Filter items: Show Admin Panel only if user.role is 'admin'
  const filteredItems = NAV_ITEMS.filter(item => {
    if (item.id === ToolType.ADMIN_PANEL) {
      return user?.role === 'admin';
    }
    return true;
  });

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white p-4 border-r border-gray-800 h-screen sticky top-0">
      <h1 className="text-xl font-bold mb-6 px-2 flex items-center space-x-2">
        <span className="text-yellow-500 text-2xl">⚖️</span>
        <span>LegalPH</span>
      </h1>

      <nav className="flex flex-col gap-2 flex-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTool === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? "bg-yellow-500 text-black shadow-md ring-2 ring-yellow-400 font-semibold"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="pt-4 border-t border-gray-800 mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/50">
           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${user?.role === 'admin' ? 'bg-red-600' : 'bg-yellow-600'}`}>
             {user?.name.charAt(0).toUpperCase() || 'U'}
           </div>
           <div>
             <p className="text-sm font-medium truncate w-32">{user?.name || 'User'}</p>
             <p className="text-xs text-gray-400 capitalize">{user?.role} Plan</p>
           </div>
        </div>
      </div>
    </aside>
  );
}
