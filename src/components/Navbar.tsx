import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  Search,
  Plane,
  FileText,
  AlertTriangle,
  Cpu,
  Layers,
  CheckCircle,
  PackageCheck,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  LayoutDashboard,
  Box,
} from 'lucide-react';
import { MOCK_USERS } from '../data/mockData';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedAircraft,
    setGlobalSearchOpen,
    userRole,
    setUserRole,
    tasks,
    comparedPartNumbers,
  } = useApp();

  const currentUser = MOCK_USERS.find(u => u.role === userRole) || MOCK_USERS[0];
  const aogCount = tasks.filter(t => t.priority === 'AOG' && t.status !== 'Completed').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'aircraft', label: 'Fleet Assets', icon: Plane },
    { id: 'systems', label: 'System Explorer', icon: Layers },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Wrench },
    { id: 'parts', label: 'Parts Finder', icon: PackageCheck },
    { id: 'compatibility', label: 'Compatibility', icon: CheckCircle },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Cpu, badge: 'Gemini 3.6' },
    { id: 'documents', label: 'Documentation', icon: FileText },
    { id: 'maintenance', label: 'Tasks', icon: ShieldAlert, count: tasks.filter(t => t.status !== 'Completed').length },
    { id: 'inventory', label: 'Tool Crib', icon: Box },
  ];

  return (
    <header className="bg-[#0f172a] border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-slate-950/90 border-b border-slate-800/80 px-4 py-1 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> FAA / EASA System Online
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 text-[11px]">
            AeroFix MRO Decision Support System — Verify procedures against current AMM / FIM manuals.
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          {aogCount > 0 && (
            <span className="inline-flex items-center gap-1 font-bold text-red-400 bg-red-950/90 border border-red-800/80 px-2.5 py-0.5 rounded-full animate-pulse">
              <AlertTriangle className="w-3 h-3 text-red-400" /> {aogCount} AOG DEFECTS
            </span>
          )}
          <span className="text-slate-400">Station: <strong className="text-slate-200">{currentUser.assignedStation}</strong></span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:bg-blue-500 transition-colors">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-white">AeroFix<span className="text-blue-400">MRO</span></span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">v3.8</span>
            </div>
          </div>
        </div>

        {/* Global Search Trigger Bar */}
        <button
          onClick={() => setGlobalSearchOpen(true)}
          className="hidden md:flex items-center gap-3 bg-slate-800/90 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg border border-slate-700 text-xs transition-colors flex-1 max-w-md shadow-inner"
        >
          <Search className="w-4 h-4 text-blue-400" />
          <span className="truncate text-slate-300">Search aircraft, ATA chapter, symptom, or part number...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">Ctrl+K</kbd>
        </button>

        {/* Selected Aircraft & Role Quick Pill */}
        <div className="flex items-center gap-2">
          {/* Aircraft Pill */}
          <button
            onClick={() => setActiveTab('aircraft')}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors"
            title="Click to change active aircraft"
          >
            <Plane className="w-4 h-4 text-blue-400" />
            <div className="text-left hidden sm:block">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Selected Fleet</div>
              <div className="font-bold text-white leading-tight">{selectedAircraft.name}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* User Role Switcher */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 text-xs transition-colors">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <div className="text-left hidden lg:block">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Role</div>
                <div className="font-semibold text-emerald-400 capitalize">{currentUser.name}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-1 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Switch User Role
              </div>
              <div className="mt-1 space-y-1">
                {MOCK_USERS.map(u => (
                  <button
                    key={u.id}
                    onClick={() => setUserRole(u.role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      userRole === u.role
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/50'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="capitalize font-medium text-white">{u.role}</div>
                      <div className="text-[10px] text-slate-400">{u.name} — {u.title}</div>
                    </div>
                    {userRole === u.role && <CheckCircle className="w-3.5 h-3.5 text-blue-400" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar border-t border-slate-800/80 pt-1 text-xs">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-lg font-medium whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border-blue-500 font-bold'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>

              {item.badge && (
                <span className="text-[9px] font-bold bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30 uppercase">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded-full border border-slate-700">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {comparedPartNumbers.length > 0 && (
          <button
            onClick={() => setActiveTab('compatibility')}
            className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold animate-pulse"
          >
            Compare ({comparedPartNumbers.length})
          </button>
        )}
      </nav>
    </header>
  );
};
