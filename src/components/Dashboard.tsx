import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Wrench,
  PackageSearch,
  Plane,
  FileText,
  ClipboardList,
  Layers,
  Cpu,
  BarChart3,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Box,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { MOCK_AIRCRAFT, MOCK_PARTS } from '../data/mockData';

export const Dashboard: React.FC = () => {
  const {
    setSelectedAircraft,
    setSelectedPartForDetail,
    setActiveTab,
    setGlobalSearchOpen,
    tasks,
    userRole,
  } = useApp();

  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    setGlobalSearchOpen(true);
  };

  const aogTasks = tasks.filter(t => t.priority === 'AOG' && t.status !== 'Completed');
  const openTasks = tasks.filter(t => t.status !== 'Completed');
  const partsWaiting = tasks.filter(t => t.status === 'Waiting for Parts');
  const completedTasks = tasks.filter(t => t.status === 'Completed');

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Section */}
      <div className="relative rounded-2xl bg-[#0f172a] p-6 sm:p-10 border border-slate-800 shadow-xl overflow-hidden text-white">
        {/* Background Aviation Graphic Accents */}
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none hidden lg:flex items-center pr-12">
          <Plane className="w-96 h-96 text-blue-400 rotate-12" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30 uppercase tracking-wider">
              AEROFIX MRO INTELLIGENCE PLATFORM
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              FAA Part 145 / EASA Standard
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Aviation Maintenance, Diagnostics & Parts Intelligence
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              All-in-one aircraft engineering decision platform. Instantly diagnose complex faults, search cross-referenced replacement parts, review AMM/FIM manuals, and manage fleet maintenance work orders.
            </p>
          </div>

          {/* Large Central Search Bar */}
          <form onSubmit={handleHeroSubmit} className="relative max-w-2xl">
            <div className="relative flex items-center bg-slate-900/90 rounded-xl border-2 border-blue-500/50 focus-within:border-blue-400 shadow-xl overflow-hidden p-1.5 transition-all">
              <Search className="w-5 h-5 text-blue-400 ml-3 shrink-0" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Search aircraft, system, fault, symptom, component, part number, ATA chapter, or maintenance task..."
                className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm px-3 py-2.5 focus:outline-none"
              />
              <button
                type="submit"
                onClick={() => setGlobalSearchOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400 px-1">
              <span className="text-slate-400 font-medium">Popular:</span>
              <button type="button" onClick={() => { setActiveTab('parts'); }} className="hover:text-blue-300 underline underline-offset-2">737 hydraulic pump</button>
              <span>•</span>
              <button type="button" onClick={() => { setActiveTab('troubleshooting'); }} className="hover:text-blue-300 underline underline-offset-2">Nose wheel steering fault</button>
              <span>•</span>
              <button type="button" onClick={() => { setActiveTab('systems'); }} className="hover:text-blue-300 underline underline-offset-2">ATA 32 Landing Gear</button>
            </div>
          </form>

          {/* Quick Action Navigation Grid */}
          <div className="pt-2">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Quick MRO Actions</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => setActiveTab('troubleshooting')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Diagnose Fault</div>
                  <div className="text-[10px] text-slate-500 font-normal">Symptom workflow</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('parts')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <PackageSearch className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Find a Part</div>
                  <div className="text-[10px] text-slate-500 font-normal">NSN, CAGE & P/N</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('aircraft')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Select Aircraft</div>
                  <div className="text-[10px] text-slate-500 font-normal">Boeing, Airbus, Heli</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Tech Manuals</div>
                  <div className="text-[10px] text-slate-500 font-normal">AMM, IPC, FIM, SB</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Work Tasks</div>
                  <div className="text-[10px] text-slate-500 font-normal">Open work orders</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('systems')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Systems DB</div>
                  <div className="text-[10px] text-slate-500 font-normal">ATA chapters matrix</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">AI Specialist</div>
                  <div className="text-[10px] text-slate-500 font-normal">Gemini 3.6 Flash</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('inventory')}
                className="flex items-center gap-2.5 p-3 rounded-xl bg-white hover:bg-blue-50/80 text-slate-800 border border-slate-200 hover:border-blue-300 text-xs font-semibold text-left transition-all group shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Box className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-blue-600">Inventory & Tools</div>
                  <div className="text-[10px] text-slate-500 font-normal">Calibrated tool crib</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Maintenance Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Aircraft In Maintenance</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">4 <span className="text-xs font-normal text-slate-500">Active</span></div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 2 Line Stations Operational
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Plane className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">AOG / Critical Defects</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{aogTasks.length} <span className="text-xs font-normal text-red-500">Immediate Action</span></div>
            <div className="text-[11px] text-red-600 font-semibold flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 text-red-600" /> N737AF Nose Gear Actuator
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Parts Waiting / AOG Hold</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{partsWaiting.length} <span className="text-xs font-normal text-slate-500">Shipments</span></div>
            <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-amber-600" /> B777 IDG Scavenge Filter
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <PackageSearch className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Open Tasks Total</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">{openTasks.length} <span className="text-xs font-normal text-slate-500">Work Orders</span></div>
            <div className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> {completedTasks.length} Signed Off Today
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Active Work Orders + Recently Used Aircraft & Parts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Fleet Tasks (Col Span 2) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-blue-600" /> Active Maintenance Tasks & Defects
              </h3>
              <p className="text-xs text-slate-500">Real-time status of work orders across stations</p>
            </div>
            <button
              onClick={() => setActiveTab('maintenance')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All ({tasks.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <div
                key={task.id}
                className="p-4 bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-colors space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-600 text-xs">{task.taskNumber}</span>
                    <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">{task.aircraftReg} ({task.aircraftModelName})</span>
                    <span className="text-xs text-slate-500 font-mono">{task.ataCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        task.priority === 'AOG'
                          ? 'bg-red-100 text-red-700 border border-red-200 animate-pulse'
                          : task.priority === 'High'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {task.priority}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        task.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                          : task.status === 'In Progress'
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : task.status === 'Waiting for Parts'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{task.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-1">{task.reportedDefect}</p>

                <div className="pt-2 border-t border-slate-200/80 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <div>Technician: <strong className="text-slate-700">{task.technician}</strong></div>
                  <div>AMM Ref: <span className="font-mono text-blue-600 font-semibold">{task.ammReference}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Used Aircraft & Recently Searched Parts (Col 3) */}
        <div className="space-y-6">
          {/* Recently Used Aircraft Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Plane className="w-4 h-4 text-blue-600" /> Recently Active Aircraft
              </h3>
              <button onClick={() => setActiveTab('aircraft')} className="text-xs text-blue-600 font-bold hover:underline">Select</button>
            </div>

            <div className="space-y-2">
              {MOCK_AIRCRAFT.slice(0, 4).map(ac => (
                <div
                  key={ac.id}
                  onClick={() => {
                    setSelectedAircraft(ac);
                    setActiveTab('systems');
                  }}
                  className="p-3 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-600">{ac.name}</div>
                    <div className="text-[10px] text-slate-500">{ac.family} • {ac.engines[0]}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Recently Searched Parts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-emerald-600" /> Fast Parts Reference
              </h3>
              <button onClick={() => setActiveTab('parts')} className="text-xs text-emerald-600 font-bold hover:underline">Catalog</button>
            </div>

            <div className="space-y-2">
              {MOCK_PARTS.slice(0, 4).map(part => (
                <div
                  key={part.partNumber}
                  onClick={() => {
                    setSelectedPartForDetail(part);
                    setActiveTab('parts');
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 rounded-xl cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="font-mono font-bold text-xs text-emerald-700 group-hover:text-emerald-800">{part.partNumber}</div>
                    <div className="text-[11px] text-slate-600 line-clamp-1">{part.description}</div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                    ${part.priceUsd.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
