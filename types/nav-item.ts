
import React from 'react';
import { ToolType } from "./tool-type";

export interface NavItem {
  id: ToolType;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  description?: string;
}
