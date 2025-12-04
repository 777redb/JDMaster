
import { BookOpen, LayoutDashboard, Scale, Search, FileText, PenTool, Gavel } from "lucide-react";
import { NavItem } from "../types/nav-item";
import { ToolType } from "../types/tool-type";

export const NAV_ITEMS: NavItem[] = [
  { id: ToolType.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, description: 'Overview of activity and tools' },
  { id: ToolType.CASE_DIGEST, label: 'Case Digest', icon: BookOpen, description: 'AI-Assisted Case Digest Generator' },
  { id: ToolType.MOCK_BAR, label: 'Mock Bar', icon: Scale, description: 'Simulate Bar Exam Questions' },
  { id: ToolType.CASE_BUILD, label: 'Case Build', icon: Search, description: 'Legal Research & Case Builder' },
  { id: ToolType.LAW_REVIEWER, label: 'Reviewer', icon: FileText, description: 'Structured Law Reviewer Mode' },
  { id: ToolType.CONTRACT_DRAFTING, label: 'Contracts', icon: PenTool, description: 'AI Contract Drafting Engine' },
  { id: ToolType.LEGAL_PAD, label: 'Legal Pad', icon: Gavel, description: 'Smart Workspace for Legal Notes' },
];
